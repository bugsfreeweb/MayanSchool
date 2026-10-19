import LearningHub from "@/components/learning-hub";
import { getGames } from "@/lib/server";
export const dynamic = "force-dynamic";
export const metadata = { title: "আমার অগ্রগতি" };
export default async function ProgressPage() { return <LearningHub games={await getGames()} view="learning"/>; }
