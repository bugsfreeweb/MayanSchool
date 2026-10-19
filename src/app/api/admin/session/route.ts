import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminSession, isAdmin, isDemoAdmin } from "@/lib/server";
import { timingSafeEqual } from "node:crypto";

const loginAttempts = new Map<string, { count: number; until: number }>();
export async function GET() { return NextResponse.json({ authenticated: await isAdmin(), demo: isDemoAdmin() }); }
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const current = loginAttempts.get(ip);
  if (current && current.until > Date.now() && current.count >= 10) return NextResponse.json({ error: "অনেকবার চেষ্টা হয়েছে। ১০ মিনিট পরে চেষ্টা করুন।" }, { status: 429 });
  const body = await request.json().catch(() => ({}));
  const password = process.env.ADMIN_PASSWORD;
  if (!password && !isDemoAdmin()) return NextResponse.json({ error: "সার্ভারে ADMIN_PASSWORD সেট করুন। লাইভ সাইটে ডেমো অ্যাক্সেস বন্ধ।" }, { status: 503 });
  if (password) {
    const input = typeof body.password === "string" ? body.password : "";
    if (Buffer.byteLength(input) !== Buffer.byteLength(password) || !timingSafeEqual(Buffer.from(input), Buffer.from(password))) {
      loginAttempts.set(ip, { count: current && current.until > Date.now() ? current.count + 1 : 1, until: Date.now() + 600000 });
      return NextResponse.json({ error: "পাসওয়ার্ড সঠিক নয়।" }, { status: 401 });
    }
  }
  loginAttempts.delete(ip);
  await createAdminSession();
  return NextResponse.json({ authenticated: true, demo: isDemoAdmin() });
}
export async function DELETE() { (await cookies()).delete("mayan_admin"); return NextResponse.json({ authenticated: false }); }
