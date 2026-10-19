import { getQuestions, type Subject } from "@/lib/content";
import { vowels, consonants } from "@/lib/bangla";
export type Chapter = { id: string; title: string; description: string; ages: string; games: string[] };
export const curriculum: Record<Subject, Chapter[]> = {
  bangla: [
    { id: "bn-vowels", title: "স্বরবর্ণের সাথে পরিচয়", description: "অ থেকে ঔ—ছবিতে, কথায়, আনন্দে", ages: "৪–৬ বছর", games: ["bangla-vowels", "bangla-vowel-discovery"] },
    { id: "bn-consonants", title: "ব্যঞ্জনবর্ণের বন্ধু", description: "বর্ণ চিনি, ছবির সাথে মিলাই", ages: "৪–৭ বছর", games: ["bangla-consonants", "bangla-letter-match"] },
    { id: "bn-words", title: "বর্ণ থেকে শব্দ", description: "কার-চিহ্ন শিখি, নতুন শব্দ গড়ি", ages: "৫–৯ বছর", games: ["bangla-words", "bangla-kar"] },
    { id: "bn-sentences", title: "বাক্য আর ছড়ার জগৎ", description: "নিজের কথা বলি, ছন্দের মিল খুঁজি", ages: "৬–১০ বছর", games: ["bangla-sentences", "bangla-rhymes"] },
  ],
  math: [
    { id: "math-intro", title: "সংখ্যা ও আকৃতির পরিচয়", description: "চারপাশের জগৎ গুনে দেখি", ages: "৪–৬ বছর", games: ["number-garden", "shape-detective"] },
    { id: "math-operations", title: "যোগ-বিয়োগের মজা", description: "ছোট ছোট হিসাব নিজেই করি", ages: "৬–১০ বছর", games: ["addition-magic", "subtraction-stars"] },
  ],
  english: [
    { id: "en-first", title: "অক্ষর থেকে শব্দ", description: "A, B, C আর পরিচিত জিনিসের নাম", ages: "৪–৮ বছর", games: ["alphabet-adventure", "word-friends"] },
    { id: "en-spelling", title: "সঠিক বানান শিখি", description: "অক্ষর সাজিয়ে নতুন শব্দ", ages: "৭–১০ বছর", games: ["spelling-bee"] },
  ],
  science: [
    { id: "science-nature", title: "আমাদের আশপাশের পৃথিবী", description: "প্রকৃতি ও প্রাণীদের চিনতে শিখি", ages: "৪–৮ বছর", games: ["little-scientist", "animal-world"] },
    { id: "science-space", title: "আকাশের ওপারে", description: "সূর্য, চাঁদ আর আমাদের সৌরজগৎ", ages: "৭–১০ বছর", games: ["solar-system"] },
  ],
  creativity: [
    { id: "creative-colors", title: "রঙের সাথে বন্ধুত্ব", description: "রং চিনি, মিশিয়ে নতুন রং বানাই", ages: "৪–৭ বছর", games: ["color-studio"] },
    { id: "creative-memory", title: "মনোযোগের ছোট্ট খেলা", description: "ছবি মনে রাখি, জোড়া মিলাই", ages: "৪–১০ বছর", games: ["memory-match"] },
  ],
};
export type LessonCard = { symbol: string; title: string; body: string };
const letterCards = (list: string[][]) => list.map(([letter, word, emoji]) => ({ symbol: letter, title: `${letter} — ${word} ${emoji}`, body: `${word} শব্দে ${letter} বর্ণটি দেখো। বর্ণের আকার মনে রাখি, এবার নিজে বলে দেখি।` }));
const notes: Record<string, LessonCard[]> = {
  "bangla-vowels": letterCards(vowels.slice(0, 6)),
  "bangla-vowel-discovery": letterCards(vowels.slice(6)),
  "bangla-consonants": letterCards(consonants.slice(0, 5)),
  "bangla-letter-match": letterCards([consonants[20], consonants[21], consonants[22], consonants[24], consonants[33]]),
  "bangla-words": [
    { symbol: "কলা", title: "ছোট্ট একটি ফলের নাম", body: "কলা আমাদের পরিচিত ফল। ক-লা—দুই ভাগে ধীরে পড়ে দেখি।" },
    { symbol: "বই", title: "আমাদের শেখার বন্ধু", body: "বই পড়ে নতুন কথা জানা যায়। ব-ই মিলে বই।" },
    { symbol: "কলম", title: "লেখার সঙ্গী", body: "কলম দিয়ে লিখি। ক-ল-ম—তিনটি বর্ণ খুঁজে দেখি।" },
    { symbol: "বিড়াল", title: "প্রাণীর নাম শিখি", body: "বিড়াল একটি প্রাণী। শব্দটি পড়ি আর ছবিটি মনে করি।" },
  ],
  "bangla-kar": [
    { symbol: "ক + া = কা", title: "আ-কার", body: "আ-কার বর্ণের ডান পাশে বসে। ম + া = মা, ক + া = কা।" },
    { symbol: "ক + ি = কি", title: "ই-কার", body: "ই-কার বর্ণের বাম পাশে লেখা হয়। ক + ি = কি।" },
    { symbol: "ফ + ু = ফু", title: "উ-কার", body: "উ-কার বর্ণের নিচে বসে। ফু + ল = ফুল।" },
    { symbol: "ক + ে = কে", title: "এ-কার", body: "এ-কার বর্ণের বাম পাশে বসে। ক + ে = কে।" },
  ],
  "bangla-sentences": [
    { symbol: "আমি বই পড়ি।", title: "শব্দ সাজাই, মনের কথা বলি", body: "অর্থপূর্ণভাবে সাজানো শব্দগুলো মিলে বাক্য হয়। আমি কী করি? আমি বই পড়ি।" },
    { symbol: "আমি স্কুলে যাই।", title: "বাক্যের শব্দগুলো", body: "আমি + স্কুলে + যাই—শব্দগুলো সাজালে একটি অর্থপূর্ণ বাক্য হয়।" },
    { symbol: "।  ?", title: "দাঁড়ি ও প্রশ্নচিহ্ন", body: "সাধারণ বাক্যের শেষে দাঁড়ি (।), আর প্রশ্নের শেষে প্রশ্নচিহ্ন (?) বসে। তোমার নাম কী?" },
  ],
  "bangla-rhymes": [
    { symbol: "আম · জাম", title: "শব্দের মিল খুঁজি", body: "আম আর জাম বলো। দুটো শব্দের শেষের ধ্বনি মিলে যাচ্ছে, তাই না?" },
    { symbol: "আলো · ভালো", title: "মিলেই ছন্দের আনন্দ", body: "ফুল–দুল, আলো–ভালো—নিজে আরও মিলে যায় এমন শব্দ খুঁজে দেখো।" },
    { symbol: "মেলে ডানা", title: "আমাদের ছোট্ট ছড়া", body: "ছোট্ট পাখি, মেলে ডানা—উড়তে তার নেই মানা! ডানা আর মানা শব্দে মিল আছে।" },
  ],
  "memory-match": [
    { symbol: "☀", title: "দেখি আর মনে রাখি", body: "একটি কার্ড উল্টে ছবিটি দেখো। ছবিটি কোথায় আছে, মনে রাখো।" },
    { symbol: "☀  ☀", title: "একই ছবির জোড়া", body: "একই ছবির দুটি কার্ড খুঁজে বের করো। তাড়াহুড়ো নয়, মন দিয়ে খেয়াল করো।" },
  ],
};
export const getLessonCards = (id: string): LessonCard[] => notes[id] ?? getQuestions(id).slice(0, 3).map((question) => ({ symbol: question.visual.split(":").slice(1).join(":") || "✦", title: question.options[question.answer], body: question.explanation }));
