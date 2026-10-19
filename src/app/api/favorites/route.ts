import { NextResponse } from "next/server";
import { setFavorite } from "@/db/repository";
import { getLearner, findPublishedGame } from "@/lib/server";

export async function POST(request: Request) {
  try {
    const learner = (await getLearner())!;
    const { gameId, saved } = await request.json();
    if (typeof gameId !== "string" || typeof saved !== "boolean" || !(await findPublishedGame(gameId))) return NextResponse.json({ error: "গেমটি পাওয়া যায়নি।" }, { status: 404 });
    await setFavorite(learner.id, gameId, saved);
    return NextResponse.json({ saved });
  } catch { return NextResponse.json({ error: "গেমটি সংরক্ষণ করা যায়নি।" }, { status: 500 }); }
}
