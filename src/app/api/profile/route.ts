import { NextResponse } from "next/server";
import { getLearner, getLearnerData } from "@/lib/server";
import { updateLearner } from "@/db/repository";

export async function GET() {
  try { return NextResponse.json(await getLearnerData()); }
  catch (error) { console.error("Profile error", error); return NextResponse.json({ error: "প্রোফাইল লোড হয়নি। আবার চেষ্টা করুন।" }, { status: 500 }); }
}
export async function PATCH(request: Request) {
  try {
    const learner = (await getLearner())!;
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : learner.name;
    const age = body.age === undefined ? learner.age : Number(body.age);
    const dailyGoal = body.dailyGoal === undefined ? learner.dailyGoal : Number(body.dailyGoal);
    if (!name || name.length > 30 || !Number.isInteger(age) || age < 3 || age > 10 || ![10, 15, 20, 30].includes(dailyGoal)) return NextResponse.json({ error: "সঠিক নাম, বয়স (৩–১০) ও দৈনিক লক্ষ্য দিন।" }, { status: 400 });
    await updateLearner(learner.id, { name, age, dailyGoal });
    return NextResponse.json(await getLearnerData());
  } catch { return NextResponse.json({ error: "পরিবর্তন সংরক্ষণ করা যায়নি।" }, { status: 500 }); }
}
