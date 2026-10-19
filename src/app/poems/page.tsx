import LearningHub from "@/components/learning-hub";
import { getGames } from "@/lib/server";
export const dynamic = "force-dynamic";
export const metadata = { title: "কবিতা ও ছড়া" };
export default async function PoemsPage() { return <LearningHub games={await getGames()} view="poems"/>; }
