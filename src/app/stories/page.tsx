import LearningHub from "@/components/learning-hub";
import { getGames } from "@/lib/server";
export const dynamic = "force-dynamic";
export const metadata = { title: "গল্পের ঝুলি" };
export default async function StoriesPage() { return <LearningHub games={await getGames()} view="stories"/>; }
