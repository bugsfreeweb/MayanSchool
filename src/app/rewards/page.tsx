import LearningHub from "@/components/learning-hub";
import { getGames } from "@/lib/server";
export const dynamic = "force-dynamic";
export const metadata = { title: "আমার পুরস্কার" };
export default async function RewardsPage() { return <LearningHub games={await getGames()} view="achievements"/>; }
