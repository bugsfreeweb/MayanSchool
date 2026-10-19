import LearningHub from "@/components/learning-hub";
import { getGames } from "@/lib/server";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const games = await getGames();
  return <LearningHub games={games} />;
}
