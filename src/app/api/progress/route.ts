import { NextResponse } from "next/server";
import { saveAttempt } from "@/db/repository";
import { getLearner, findPublishedGame } from "@/lib/server";
import { getQuestions } from "@/lib/content";

export async function POST(request: Request) {
  try {
    const learner = (await getLearner())!;
    const body = await request.json();
    const game = typeof body.gameId === "string" ? await findPublishedGame(body.gameId) : null;
    if (!game) return NextResponse.json({ error: "গেমটি পাওয়া যায়নি।" }, { status: 404 });
    const duration = Number(body.duration);
    if (!Number.isFinite(duration) || duration < 1 || duration > 3600) return NextResponse.json({ error: "খেলার সময় সঠিক নয়।" }, { status: 400 });
    let correct = 0, total = 0, stars = 0;
    if (game.kind === "quiz") {
      const questions = getQuestions(game.id);
      if (!Array.isArray(body.answers) || body.answers.length !== questions.length || !body.answers.every((a: unknown) => typeof a === "number" && Number.isInteger(a) && a >= 0 && a < 4)) return NextResponse.json({ error: "সব প্রশ্নের উত্তর সম্পূর্ণ করুন।" }, { status: 400 });
      total = questions.length;
      correct = questions.filter((question, index) => question.answer === body.answers[index]).length;
      stars = correct >= 4 ? 3 : correct >= 2 ? 2 : 1;
    } else if (game.kind === "memory") {
      if (!Number.isInteger(body.moves) || body.moves < 6 || body.moves > 1000) return NextResponse.json({ error: "সব জোড়া মিলিয়ে খেলা শেষ করুন।" }, { status: 400 });
      correct = 6; total = 6; stars = body.moves <= 10 ? 3 : body.moves <= 16 ? 2 : 1;
    } else {
      if (duration < 10) return NextResponse.json({ error: "অন্তত ১০ সেকেন্ড খেলার পর শেষ করুন।" }, { status: 400 });
      correct = 1; total = 1; stars = 1;
    }
    await saveAttempt({ learnerId: learner.id, gameId: game.id, correct, total, stars, duration: Math.round(duration) });
    return NextResponse.json({ correct, total, stars, passed: correct / total >= .6 });
  } catch { return NextResponse.json({ error: "ফলাফল সংরক্ষণ হয়নি। আবার চেষ্টা করো।" }, { status: 500 }); }
}
