import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { seedGames, type LearnerData } from "@/lib/content";
import { findLearner, insertLearner, listFavorites, listAttempts, seedLibrary, listGames, getGame } from "@/db/repository";
let seeded: Promise<void> | undefined;
export async function ensureGames() { if (!seeded) seeded = seedLibrary().catch((error) => { seeded = undefined; throw error; }); return seeded; }
export async function getGames(includeDrafts = false) {
  await ensureGames();
  const rows = await listGames(includeDrafts), order = seedGames.map((game) => game.id);
  return rows.sort((a, b) => { if (a.featured !== b.featured) return a.featured ? -1 : 1; const ai = order.indexOf(a.id), bi = order.indexOf(b.id); return ai < 0 ? bi < 0 ? 0 : -1 : bi < 0 ? 1 : ai - bi; });
}
export async function getLearner(create = true) {
  const jar = await cookies();
  const id = jar.get("mayan_learner")?.value || jar.get("funzy_learner")?.value;
  if (id && /^[0-9a-f-]{36}$/i.test(id)) { const found = await findLearner(id); if (found) return found; }
  if (!create) return null;
  const learner = await insertLearner();
  jar.set("mayan_learner", learner.id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 31536000 });
  return learner;
}
const dayKey = (value: Date | string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
export async function getLearnerData(): Promise<LearnerData> {
  const learner = (await getLearner())!;
  const [saved, history] = await Promise.all([listFavorites(learner.id), listAttempts(learner.id)]);
  const today = dayKey(new Date()), dates = new Set(history.map((a) => dayKey(a.completedAt)));
  let streak = 0, cursor = Date.now();
  if (!dates.has(dayKey(new Date(cursor)))) cursor -= 86400000;
  while (dates.has(dayKey(new Date(cursor)))) { streak++; cursor -= 86400000; }
  const completedIds = [...new Set(history.map((a) => a.gameId))];
  const masteredIds = [...new Set(history.filter((a) => a.total > 0 && a.correct / a.total >= .6).map((a) => a.gameId))];
  const week = Array.from({ length: 7 }, (_, index) => dates.has(dayKey(new Date(Date.now() - (6 - index) * 86400000))));
  return { name: learner.name, age: learner.age, dailyGoal: learner.dailyGoal, favorites: saved,
    stats: { stars: history.reduce((n, a) => n + a.stars, 0), completed: completedIds.length, sessions: history.length, minutes: Math.ceil(history.reduce((n, a) => n + a.duration, 0) / 60), todayMinutes: Math.ceil(history.filter((a) => dayKey(a.completedAt) === today).reduce((n, a) => n + a.duration, 0) / 60), streak, completedIds, masteredIds, week }, recent: history.slice(0, 20) };
}
const globalSession = globalThis as typeof globalThis & { mayanDemoSecret?: string };
function signature(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || (globalSession.mayanDemoSecret ??= randomBytes(32).toString("hex"));
  return createHmac("sha256", secret).update(`mayan-admin:${value}`).digest("hex");
}
export const isDemoAdmin = () => !process.env.ADMIN_PASSWORD && !process.env.VERCEL;
export async function isAdmin() {
  const token = (await cookies()).get("mayan_admin")?.value;
  if (!token) return false;
  const [expiry, signed] = token.split(".");
  if (!expiry || !signed || !/^\d+$/.test(expiry) || Number(expiry) < Date.now() || !/^[a-f0-9]{64}$/.test(signed)) return false;
  return timingSafeEqual(Buffer.from(signed), Buffer.from(signature(expiry)));
}
export async function createAdminSession() {
  const expiry = String(Date.now() + 28800000);
  (await cookies()).set("mayan_admin", `${expiry}.${signature(expiry)}`, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 28800, path: "/" });
}
export async function findPublishedGame(id: string) { const game = await getGame(id); return game?.published ? game : undefined; }
