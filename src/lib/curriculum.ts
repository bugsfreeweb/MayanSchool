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
    { id: "creative-colors", title: "রঙের সাথে বন্ধুত্ব", description: "রং চিনি, মিশিয়ে নতুন রং বানাই", ages: "৪–৭ বছর", games: ["color-studio"] },
    { id: "creative-memory", title: "মনোযোগের ছোট্ট খেলা", description: "ছবি মনে রাখি, জোড়া মিলাই", ages: "৪–১০ বছর", games: ["memory-match"] },
  ],
  general: [
    { id: "gk-bangladesh", title: "আমাদের বাংলাদেশ", description: "পতাকা, প্রতীক আর জাতীয় পরিচয় জানি", ages: "৪–৮ বছর", games: ["bd-symbols", "bd-culture"] },
    { id: "gk-life", title: "ভালো মানুষ হওয়ার পাঠ", description: "সহায়ক মানুষ, অভ্যাস ও নিরাপত্তা শিখি", ages: "৪–৯ বছর", games: ["community-helpers", "good-habits", "transport-world"] },
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
    { symbol: "☀", title: "দেখি আর মনে রাখি", body: "একটি কার্ড উল্টে ছবিটি দেখো। ছবিটি কোথায় আছে, মনে রাখো।" },
    { symbol: "☀  ☀", title: "একই ছবির জোড়া", body: "একই ছবির দুটি কার্ড খুঁজে বের করো। তাড়াহুড়ো নয়, মন দিয়ে খেয়াল করো।" },
  ],
  "bd-symbols": [
    { symbol: "🇧🇩", title: "আমাদের লাল-সবুজ পতাকা", body: "সবুজ জমিনের মাঝে লাল বৃত্ত—এটাই আমাদের জাতীয় পতাকা।" },
    { symbol: "🪷", title: "শাপলা আমাদের জাতীয় ফুল", body: "শাপলা পানিতে ফোটে, সাদা রঙের। এটি আমাদের গর্ব।" },
    { symbol: "🐦", title: "দোয়েল আমাদের জাতীয় পাখি", body: "দোয়েল সুন্দর ডাকে। সে আমাদের দেশের প্রতীক।" },
  ],
  "community-helpers": [
    { symbol: "👩‍🏫", title: "শিক্ষক", body: "শিক্ষক আমাদের পড়ান, নতুন জিনিস চিনতে শেখান।" },
    { symbol: "👩‍⚕️", title: "ডাক্তার", body: "ডাক্তার অসুস্থ মানুষকে সুস্থ হতে সাহায্য করেন।" },
    { symbol: "👨‍🌾", title: "কৃষক", body: "কৃষক মাঠে পরিশ্রম করে আমাদের খাবার ফলান।" },
  ],
  "good-habits": [
    { symbol: "🧼", title: "হাত ধোয়ার অভ্যাস", body: "খাওয়ার আগে ও বাইরে থেকে ফিরে হাত ধুয়ে নিই।" },
    { symbol: "🚦", title: "রাস্তা পার হওয়ার নিয়ম", body: "দুই দিকে দেখে, সবুজ বাতি হলে রাস্তা পার হই।" },
    { symbol: "🙏", title: "ভালো ব্যবহার", body: "দয়া করে, ধন্যবাদ, ক্ষমা করুন—এই ছোট্ট শব্দগুলো বড় কাজ করে।" },
  ],
  "bd-culture": [
    { symbol: "🎉", title: "পহেলা বৈশাখ", body: "বৈশাখের প্রথম দিনে আমরা নববর্ষ উদযাপন করি।" },
    { symbol: "🌙", title: "ঈদ", body: "ঈদ আমাদের আনন্দ ও পুনর্মিলনের উৎসব।" },
    { symbol: "🌾", title: "নবান্ন", body: "নতুন ফসল ঘরে আসলে নবান্ন উৎসব হয়।" },
  ],
  "transport-world": [
    { symbol: "🚆", title: "ট্রেন", body: "ট্রেন রেললাইনের ওপর চলে, অনেক মানুষ একসাথে যান।" },
    { symbol: "⛵", title: "নৌকা", body: "নৌকা পানিতে ভেসে চলে, নদীর পথে।" },
    { symbol: "✈️", title: "উড়োজাহাজ", body: "উড়োজাহাজ আকাশপথে দূর দেশে নিয়ে যায়।" },
  ],
};
export const getLessonCards = (id: string): LessonCard[] => notes[id] ?? getQuestions(id).slice(0, 3).map((question) => ({ symbol: question.visual.split(":").slice(1).join(":") || "✦", title: question.options[question.answer], body: question.explanation }));
