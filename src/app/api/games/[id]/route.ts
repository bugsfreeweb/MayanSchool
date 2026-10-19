import { NextResponse } from "next/server";
import { updateGame, getGame, deleteGame } from "@/db/repository";
import type { Game } from "@/lib/content";
import { isAdmin } from "@/lib/server";
import { subjects, type Subject } from "@/lib/content";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "অ্যাডমিন হিসেবে প্রবেশ করুন।" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await request.json();
    const update: Partial<Game> = {};
    if (typeof body.published === "boolean") update.published = body.published;
    if (typeof body.featured === "boolean") update.featured = body.featured;
    if (body.title !== undefined) {
      const title = String(body.title).trim(), description = String(body.description || "").trim();
      const subject = body.subject as Subject;
      const minAge = Number(body.minAge), maxAge = Number(body.maxAge), duration = Number(body.duration);
      if (!title || title.length > 100 || description.length > 300 || !subjects.some((s) => s.id === subject) || !Number.isInteger(minAge) || !Number.isInteger(maxAge) || minAge < 3 || maxAge > 10 || minAge > maxAge || !Number.isInteger(duration) || duration < 1 || duration > 30 || !["সহজ", "মাঝারি", "চ্যালেঞ্জ"].includes(body.difficulty)) return NextResponse.json({ error: "সঠিক তথ্য দিন। বয়স ৩–১০ এবং সময় ১–৩০ মিনিট হতে হবে।" }, { status: 400 });
      Object.assign(update, { title, description, subject, minAge, maxAge, duration, difficulty: body.difficulty });
    }
    if (!Object.keys(update).length) return NextResponse.json({ error: "কোনো পরিবর্তন দেওয়া হয়নি।" }, { status: 400 });
    const game = await updateGame(id, update);
    return game ? NextResponse.json({ game }) : NextResponse.json({ error: "গেম পাওয়া যায়নি।" }, { status: 404 });
  } catch { return NextResponse.json({ error: "পরিবর্তন সংরক্ষণ হয়নি।" }, { status: 500 }); }
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "অ্যাডমিন হিসেবে প্রবেশ করুন।" }, { status: 401 });
  const { id } = await params;
  const game = await getGame(id);
  if (!game) return NextResponse.json({ error: "গেম পাওয়া যায়নি।" }, { status: 404 });
  if (game.kind !== "upload") return NextResponse.json({ error: "প্ল্যাটফর্মের নিজস্ব গেম মুছে না দিয়ে অপ্রকাশিত করতে পারেন।" }, { status: 400 });
  await deleteGame(id);
  return NextResponse.json({ deleted: true });
}
