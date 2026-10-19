import { notFound } from "next/navigation";
import LearningHub from "@/components/learning-hub";
import { getGames } from "@/lib/server";
import { subjects, type Subject } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  if (!subjects.some((item) => item.id === subject)) notFound();
  return <LearningHub games={await getGames()} view="subject" initialSubject={subject as Subject}/>;
}
