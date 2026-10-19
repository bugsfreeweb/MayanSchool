import { notFound } from "next/navigation";
import LearningHub from "@/components/learning-hub";
import { getGames } from "@/lib/server";
export const dynamic = "force-dynamic";
export default async function SectionPage({ params, searchParams }: { params: Promise<{ section: string }>; searchParams: Promise<{ q?: string }> }) {
  const { section } = await params;
  if (!["games", "lessons", "learning", "achievements", "parents", "poems", "stories", "progress", "rewards", "settings"].includes(section)) notFound();
  const { q } = await searchParams;
  return <LearningHub games={await getGames()} view={section} initialQuery={typeof q === "string" ? q : ""}/>;
}
