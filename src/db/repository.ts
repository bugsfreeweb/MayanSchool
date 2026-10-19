import { db, databaseBoolean, type Executor } from "@/db";
import { sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { seedGames, type Game, type Subject } from "@/lib/content";

type Row = Record<string, unknown>;
const iso = (value: unknown) => value instanceof Date ? value.toISOString() : String(value);
const asGame = (row: Row): Game => ({ id: String(row.id), title: String(row.title), description: String(row.description), subject: row.subject as Subject, minAge: Number(row.min_age), maxAge: Number(row.max_age), duration: Number(row.duration), difficulty: String(row.difficulty), thumbnail: String(row.thumbnail), kind: row.kind as Game["kind"], entryPath: row.entry_path == null ? null : String(row.entry_path), published: Boolean(row.published), featured: Boolean(row.featured), createdAt: iso(row.created_at) });
export type Learner = { id: string; name: string; age: number; dailyGoal: number };
const asLearner = (row: Row): Learner => ({ id: String(row.id), name: String(row.name), age: Number(row.age), dailyGoal: Number(row.daily_goal) });
export async function insertGame(game: Game, executor: Executor = db) {
  await executor.execute(sql`INSERT INTO games (id,title,description,subject,min_age,max_age,duration,difficulty,thumbnail,kind,entry_path,published,featured,created_at) VALUES (${game.id},${game.title},${game.description},${game.subject},${game.minAge},${game.maxAge},${game.duration},${game.difficulty},${game.thumbnail},${game.kind},${game.entryPath},${databaseBoolean(game.published)},${databaseBoolean(game.featured)},${new Date().toISOString()}) ON CONFLICT (id) DO NOTHING`);
}
export async function seedLibrary() { await db.transaction(async (tx) => { for (const game of seedGames) await insertGame(game, tx); }); }
export async function listGames(includeDrafts = false) {
  const { rows } = await db.execute(sql`SELECT * FROM games ${includeDrafts ? sql`` : sql`WHERE published = ${databaseBoolean(true)}`} ORDER BY featured DESC, created_at ASC`);
  return rows.map(asGame);
}
export async function getGame(id: string) { const { rows } = await db.execute(sql`SELECT * FROM games WHERE id = ${id}`); return rows[0] ? asGame(rows[0]) : undefined; }
export async function updateGame(id: string, changes: Partial<Game>) {
  const allowed: Record<string, string> = { title: "title", description: "description", subject: "subject", minAge: "min_age", maxAge: "max_age", duration: "duration", difficulty: "difficulty", published: "published", featured: "featured" };
  const assignments = Object.entries(changes).filter(([key]) => allowed[key]).map(([key, value]) => sql`${sql.identifier(allowed[key])} = ${typeof value === "boolean" ? databaseBoolean(value) : value}`);
  if (assignments.length) await db.execute(sql`UPDATE games SET ${sql.join(assignments, sql`, `)} WHERE id = ${id}`);
  return getGame(id);
}
export async function deleteGame(id: string) {
  // Explicit child deletion also works with SQLite connections that do not enable FK pragmas.
  await db.transaction(async (tx) => { await tx.execute(sql`DELETE FROM favorites WHERE game_id=${id}`); await tx.execute(sql`DELETE FROM attempts WHERE game_id=${id}`); await tx.execute(sql`DELETE FROM game_assets WHERE game_id=${id}`); await tx.execute(sql`DELETE FROM games WHERE id=${id}`); });
}
export type Asset = { gameId: string; path: string; content: string; contentType: string; size: number };
export async function saveUploadedGame(game: Game, assets: Asset[]) {
  await db.transaction(async (tx) => {
    await insertGame(game, tx);
    for (const asset of assets) await tx.execute(sql`INSERT INTO game_assets (id,game_id,path,content,content_type,size) VALUES (${randomUUID()},${asset.gameId},${asset.path},${asset.content},${asset.contentType},${asset.size})`);
  });
  return (await getGame(game.id))!;
}
export async function getAsset(gameId: string, path: string) {
  const { rows } = await db.execute(sql`SELECT a.content,a.content_type,g.published FROM game_assets a INNER JOIN games g ON g.id=a.game_id WHERE a.game_id=${gameId} AND a.path=${path}`);
  return rows[0] ? { content: String(rows[0].content), contentType: String(rows[0].content_type), published: Boolean(rows[0].published) } : null;
}
export async function findLearner(id: string) { const { rows } = await db.execute(sql`SELECT * FROM learners WHERE id=${id}`); return rows[0] ? asLearner(rows[0]) : null; }
export async function insertLearner() {
  const learner = { id: randomUUID(), name: "আনিকা", age: 6, dailyGoal: 15 };
  await db.execute(sql`INSERT INTO learners (id,name,age,daily_goal,created_at) VALUES (${learner.id},${learner.name},${learner.age},${learner.dailyGoal},${new Date().toISOString()})`);
  return learner;
}
export async function updateLearner(id: string, value: Omit<Learner, "id">) { await db.execute(sql`UPDATE learners SET name=${value.name},age=${value.age},daily_goal=${value.dailyGoal} WHERE id=${id}`); }
export async function listFavorites(id: string) { const { rows } = await db.execute(sql`SELECT game_id FROM favorites WHERE learner_id=${id}`); return rows.map((r) => String(r.game_id)); }
export async function setFavorite(learnerId: string, gameId: string, saved: boolean) {
  if (saved) await db.execute(sql`INSERT INTO favorites (learner_id,game_id) VALUES (${learnerId},${gameId}) ON CONFLICT DO NOTHING`);
  else await db.execute(sql`DELETE FROM favorites WHERE learner_id=${learnerId} AND game_id=${gameId}`);
}
export async function saveAttempt(value: { learnerId: string; gameId: string; correct: number; total: number; stars: number; duration: number }) {
  await db.execute(sql`INSERT INTO attempts (id,learner_id,game_id,correct,total,stars,duration,completed_at) VALUES (${randomUUID()},${value.learnerId},${value.gameId},${value.correct},${value.total},${value.stars},${value.duration},${new Date().toISOString()})`);
}
export async function listAttempts(learnerId: string) {
  const { rows } = await db.execute(sql`SELECT a.*,g.title,g.subject FROM attempts a INNER JOIN games g ON g.id=a.game_id WHERE a.learner_id=${learnerId} ORDER BY a.completed_at DESC`);
  return rows.map((row) => ({ id: String(row.id), gameId: String(row.game_id), correct: Number(row.correct), total: Number(row.total), stars: Number(row.stars), duration: Number(row.duration), completedAt: iso(row.completed_at), title: String(row.title), subject: row.subject as Subject }));
}
