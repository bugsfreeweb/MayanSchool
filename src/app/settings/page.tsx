import LearningHub from "@/components/learning-hub";
import { getGames } from "@/lib/server";
export const dynamic = "force-dynamic";
export const metadata = { title: "সেটিংস" };
export default async function SettingsPage() { return <LearningHub games={await getGames()} view="settings"/>; }
