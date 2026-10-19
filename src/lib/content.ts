import { banglaGames, banglaQuestions } from "@/lib/bangla";
import { generalGames, generalQuestions } from "@/lib/general";
export type Subject = "bangla" | "math" | "english" | "science" | "creativity" | "general";
export type GameKind = "quiz" | "memory" | "upload";
export type Game = {
  id: string; title: string; description: string; subject: Subject;
  minAge: number; maxAge: number; duration: number; difficulty: string;
  thumbnail: string; kind: GameKind; entryPath: string | null;
  published: boolean; featured: boolean; createdAt?: Date | string;
};
export type LearnerData = {
  name: string; age: number; dailyGoal: number; favorites: string[];
  stats: { stars: number; completed: number; sessions: number; minutes: number; todayMinutes: number; streak: number; completedIds: string[]; masteredIds: string[]; week: boolean[] };
  recent: { id: string; gameId: string; title: string; subject: Subject; correct: number; total: number; stars: number; completedAt: string }[];
};
export const emptyLearner: LearnerData = {
  name: "আনিকা", age: 6, dailyGoal: 15, favorites: [],
  stats: { stars: 0, completed: 0, sessions: 0, minutes: 0, todayMinutes: 0, streak: 0, completedIds: [], masteredIds: [], week: [false, false, false, false, false, false, false] }, recent: [],
};
export const subjects: { id: Subject; name: string; english: string; tagline: string; color: string }[] = [
  { id: "bangla", name: "বাংলা", english: "Bangla", tagline: "আমার ভাষায়, আমার প্রথম শেখা", color: "coral" },
  { id: "math", name: "গণিত", english: "Mathematics", tagline: "সংখ্যার সাথে বন্ধুত্ব", color: "green" },
  { id: "english", name: "ইংরেজি", english: "English", tagline: "নতুন শব্দ, নতুন জগৎ", color: "orange" },
  { id: "science", name: "বিজ্ঞান", english: "Science", tagline: "কৌতূহল থেকেই আবিষ্কার", color: "blue" },
  { id: "creativity", name: "সৃজনশীলতা", english: "Creative skills", tagline: "রঙে রঙে কল্পনার ডানা", color: "purple" },
  { id: "general", name: "সাধারণ জ্ঞান", english: "General Knowledge", tagline: "চারপাশের পৃথিবীকে জানি", color: "teal" },
];
export const bn = (value: number | string) => String(value).replace(/\d/g, (n) => "০১২৩৪৫৬৭৮৯"[Number(n)]);
export const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;
const seed = (id: string, title: string, description: string, subject: Subject, minAge: number, maxAge: number, duration: number, thumbnail: string, featured = false, difficulty = "সহজ", kind: GameKind = "quiz"): Game => ({ id, title, description, subject, minAge, maxAge, duration, thumbnail: `/images/${thumbnail}.svg`, featured, difficulty, kind, entryPath: null, published: true });
export const seedGames: Game[] = [
  ...banglaGames,
  seed("number-garden", "সংখ্যার বাগান", "গুনে গুনে সংখ্যার সাথে বন্ধুত্ব করি!", "math", 4, 6, 5, "number-garden", true),
  seed("alphabet-adventure", "অক্ষরের অভিযান", "A, B, C শিখি মজার এক অভিযানে।", "english", 4, 7, 5, "alphabet-adventure", true),
  seed("little-scientist", "ছোট্ট বিজ্ঞানী", "প্রকৃতির মজার রহস্য খুঁজে বের করি।", "science", 4, 8, 6, "science-lab", true),
  seed("addition-magic", "যোগের জাদু", "ছোট ছোট সংখ্যা যোগ করে জাদু দেখাই।", "math", 6, 8, 6, "number-garden"),
  seed("word-friends", "শব্দের বন্ধু", "পরিচিত জিনিসের ইংরেজি নাম শিখি।", "english", 6, 8, 5, "alphabet-adventure"),
  seed("animal-world", "প্রাণীদের পৃথিবী", "পশুপাখির সাথে পরিচয় আর মজার শেখা।", "science", 4, 7, 5, "science-lab"),
  seed("shape-detective", "আকৃতির গোয়েন্দা", "চারপাশের নানা আকৃতি চিনতে শিখি।", "math", 4, 6, 4, "creative-world"),
  seed("color-studio", "রঙের খেলাঘর", "রঙ চিনি, রঙ মেলাই, কল্পনার ডানা মেলি।", "creativity", 4, 7, 5, "creative-world"),
  seed("subtraction-stars", "বিয়োগের তারা", "বিয়োগের ধাঁধা মিলিয়ে তারা জিতি।", "math", 7, 10, 7, "number-garden", false, "মাঝারি"),
  seed("spelling-bee", "বানানের জাদুকর", "সঠিক বানান খুঁজে শব্দের জাদুকর হই।", "english", 7, 10, 6, "alphabet-adventure", false, "মাঝারি"),
  seed("solar-system", "মহাকাশের বন্ধু", "সূর্য, চাঁদ আর গ্রহের জগৎ ঘুরে দেখি।", "science", 7, 10, 7, "science-lab", false, "মাঝারি"),
  seed("memory-match", "স্মৃতির মেলা", "ছবির জোড়া খুঁজে মনোযোগ বাড়াই।", "creativity", 4, 10, 5, "creative-world", false, "সহজ", "memory"),
  ...generalGames,
];
export type Question = { prompt: string; options: string[]; answer: number; explanation: string; visual: string };
const q = (prompt: string, options: string[], answer: number, explanation: string, visual = ""): Question => ({ prompt, options, answer, explanation, visual });
export const questionBank: Record<string, Question[]> = {
  ...banglaQuestions,
  ...generalQuestions,
  "number-garden": [
    q("এখানে কয়টি ফুল আছে?", ["২", "৩", "৪", "৫"], 1, "এক, দুই, তিন—মোট ৩টি ফুল!", "flowers:3"),
    q("৫-এর পরে কোন সংখ্যা আসে?", ["৪", "৭", "৬", "৮"], 2, "১, ২, ৩, ৪, ৫, ৬—৫-এর পরে ৬।", "number:৫ → ?"),
    q("কোন সংখ্যাটি সবচেয়ে ছোট?", ["৭", "২", "৫", "৯"], 1, "২ সবচেয়ে ছোট সংখ্যা।", "number:৭ · ২ · ৫ · ৯"),
    q("এখানে কয়টি তারা আছে?", ["৩", "৫", "৪", "৬"], 2, "গুনে দেখি—মোট ৪টি তারা!", "stars:4"),
    q("খালি জায়গায় কী হবে? ১, ২, __, ৪", ["৫", "৩", "৬", "২"], 1, "২-এর পর ৩, তারপর ৪।", "number:১  ২  ?  ৪"),
  ],
  "alphabet-adventure": [
    q("Apple কোন অক্ষর দিয়ে শুরু?", ["B", "C", "A", "D"], 2, "A for Apple—Apple মানে আপেল।", "emoji:🍎"),
    q("B-এর পরে কোন অক্ষর আসে?", ["A", "D", "E", "C"], 3, "A, B, C—B-এর পরে C।", "number:A B ?"),
    q("Cat মানে কী?", ["কুকুর", "বিড়াল", "পাখি", "মাছ"], 1, "C for Cat—Cat মানে বিড়াল।", "emoji:🐱"),
    q("Ball-এর প্রথম অক্ষর কোনটি?", ["B", "D", "P", "A"], 0, "B for Ball—বল দিয়ে আমরা খেলি!", "emoji:⚽"),
    q("D for... কোনটি সঠিক?", ["Apple", "Cat", "Dog", "Ball"], 2, "D for Dog—Dog মানে কুকুর।", "number:D"),
  ],
  "little-scientist": [
    q("গাছ বড় হতে কোনটি প্রয়োজন?", ["প্লাস্টিক", "সূর্যের আলো", "পাথর", "কাগজ"], 1, "গাছ সূর্যের আলো ব্যবহার করে নিজের খাবার তৈরি করে।", "emoji:🌱"),
    q("আমরা কোন অঙ্গ দিয়ে দেখি?", ["কান", "নাক", "চোখ", "হাত"], 2, "আমরা চোখ দিয়ে সুন্দর পৃথিবী দেখি।", "emoji:👀"),
    q("বরফ গলে কী হয়?", ["পানি", "মাটি", "বালি", "পাথর"], 0, "বরফ গরম হলে গলে পানি হয়।", "emoji:🧊"),
    q("কোন প্রাণীটি উড়তে পারে?", ["মাছ", "বিড়াল", "গরু", "প্রজাপতি"], 3, "প্রজাপতি তার সুন্দর ডানা দিয়ে উড়ে।", "emoji:🦋"),
    q("সুস্থ থাকতে আমাদের কী পান করা দরকার?", ["রং", "পরিষ্কার পানি", "তেল", "সাবান"], 1, "পরিষ্কার পানি আমাদের শরীর ভালো রাখে।", "emoji:💧"),
  ],
  "addition-magic": [
    q("২ + ৩ কত?", ["৪", "৬", "৫", "৩"], 2, "২-এর সাথে ৩ যোগ করলে ৫ হয়।", "number:২ + ৩ = ?"),
    q("৪ + ৪ কত?", ["৬", "৮", "৭", "৯"], 1, "৪ আর ৪ মিলে ৮!", "number:৪ + ৪ = ?"),
    q("তোমার ৫টি ফুল, আরও ২টি পেলে মোট কত?", ["৬", "৮", "৫", "৭"], 3, "৫ + ২ = ৭টি ফুল।", "flowers:5"),
    q("৬ + ৩ কত?", ["৯", "৮", "১০", "৭"], 0, "৬-এর পর ৭, ৮, ৯—তাই উত্তর ৯।", "number:৬ + ৩ = ?"),
    q("৭ + ৫ কত?", ["১০", "১১", "১২", "১৩"], 2, "৭ + ৩ = ১০, আরও ২ যোগে ১২।", "number:৭ + ৫ = ?"),
  ],
  "word-friends": [
    q("সূর্যকে ইংরেজিতে কী বলে?", ["Moon", "Sun", "Star", "Sky"], 1, "Sun মানে সূর্য।", "emoji:☀️"),
    q("Book মানে কী?", ["কলম", "ফুল", "বই", "চেয়ার"], 2, "Book মানে বই—আমাদের শেখার বন্ধু!", "emoji:📚"),
    q("মাছের ইংরেজি কোনটি?", ["Fish", "Bird", "Tree", "Cat"], 0, "Fish মানে মাছ।", "emoji:🐟"),
    q("পানির ইংরেজি কী?", ["Fire", "Milk", "Air", "Water"], 3, "Water মানে পানি।", "emoji:💧"),
    q("Tree মানে কী?", ["বাড়ি", "গাছ", "ফুল", "নদী"], 1, "Tree মানে গাছ।", "emoji:🌳"),
  ],
  "animal-world": [
    q("কোন প্রাণীটি পানিতে থাকে?", ["সিংহ", "মাছ", "বিড়াল", "খরগোশ"], 1, "মাছ পানিতে সাঁতার কাটে।", "emoji:🐟"),
    q("কোন প্রাণীর লম্বা শুঁড় আছে?", ["জিরাফ", "হাতি", "বাঘ", "হরিণ"], 1, "হাতির লম্বা শুঁড় থাকে।", "emoji:🐘"),
    q("কোন পাখি আমাদের ডিম দেয়?", ["কাক", "চড়ুই", "মুরগি", "ময়না"], 2, "মুরগির ডিম আমাদের পুষ্টি দেয়।", "emoji:🥚"),
    q("প্রজাপতির আগে কোন দশা আসে?", ["মাছ", "পাখি", "ডিম", "পুত্তলি"], 3, "ডিম, শুঁয়োপোকা, পুত্তলি, তারপর প্রজাপতি!", "emoji:🦋"),
    q("কোন প্রাণীটি ঘাস খায়?", ["গরু", "বাঘ", "সিংহ", "কুমির"], 0, "গরু তৃণভোজী—সে ঘাস খায়।", "emoji:🐄"),
  ],
  "shape-detective": [
    q("এই আকৃতিটির নাম কী?", ["বৃত্ত", "বর্গ", "ত্রিভুজ", "আয়তক্ষেত্র"], 0, "বৃত্ত গোল, এর কোনো কোণ নেই।", "shape:circle"),
    q("ত্রিভুজের কয়টি বাহু?", ["২", "৪", "৩", "৫"], 2, "ত্রিভুজের ৩টি বাহু ও ৩টি কোণ।", "shape:triangle"),
    q("এই আকৃতিটির নাম কী?", ["বৃত্ত", "বর্গ", "ত্রিভুজ", "ডিম্বাকার"], 1, "বর্গের চারটি বাহুই সমান।", "shape:square"),
    q("একটি বল দেখতে কোন আকৃতির মতো?", ["বর্গ", "ত্রিভুজ", "আয়তক্ষেত্র", "বৃত্ত"], 3, "বলকে সামনে থেকে দেখলে বৃত্তের মতো লাগে।", "emoji:⚽"),
    q("আয়তক্ষেত্রের কয়টি কোণ?", ["৩", "৪", "৫", "৬"], 1, "আয়তক্ষেত্রের চারটি কোণ থাকে।", "shape:rectangle"),
  ],
  "color-studio": [
    q("এটি কোন রং?", ["নীল", "লাল", "হলুদ", "সবুজ"], 1, "এটি লাল—পাকা টমেটোর রং!", "color:#e46f61"),
    q("হলুদ আর নীল মেশালে কোন রং হয়?", ["বেগুনি", "কমলা", "সবুজ", "লাল"], 2, "হলুদ ও নীল রং মিশিয়ে সবুজ তৈরি হয়।", "colors:#f2c34f,#689dc5"),
    q("এটি কোন রং?", ["সবুজ", "নীল", "কমলা", "হলুদ"], 1, "এটি নীল—পরিষ্কার আকাশের রং।", "color:#689dc5"),
    q("লাল আর হলুদ মেশালে কোন রং হয়?", ["সবুজ", "নীল", "বেগুনি", "কমলা"], 3, "লাল ও হলুদ মিশিয়ে কমলা হয়।", "colors:#e46f61,#f2c34f"),
    q("গাছের পাতা সাধারণত কোন রঙের?", ["সবুজ", "লাল", "নীল", "বেগুনি"], 0, "বেশিরভাগ গাছের পাতাই সবুজ।", "emoji:🌿"),
  ],
  "subtraction-stars": [
    q("৯ − ৪ কত?", ["৪", "৫", "৬", "৩"], 1, "৯ থেকে ৪ বাদ দিলে ৫ থাকে।", "number:৯ − ৪ = ?"),
    q("১২ − ৫ কত?", ["৬", "৮", "৭", "৯"], 2, "১২ থেকে ৫ কমালে ৭।", "number:১২ − ৫ = ?"),
    q("১৫টি ফুলের ৬টি দিলে কয়টি থাকবে?", ["৯", "৮", "১০", "৭"], 0, "১৫ − ৬ = ৯টি ফুল।", "emoji:🌼"),
    q("২০ − ৮ কত?", ["১০", "১১", "১৩", "১২"], 3, "২০ থেকে ৮ বিয়োগ করলে ১২ হয়।", "number:২০ − ৮ = ?"),
    q("১৮ − ৯ কত?", ["৮", "৯", "১০", "৭"], 1, "৯ + ৯ = ১৮, তাই ১৮ − ৯ = ৯।", "number:১৮ − ৯ = ?"),
  ],
  "spelling-bee": [
    q("আপেলের সঠিক ইংরেজি বানান কোনটি?", ["Aple", "Apple", "Apel", "Appel"], 1, "Apple—A, P, P, L, E।", "emoji:🍎"),
    q("প্রজাপতির সঠিক বানান বেছে নাও।", ["Butterfly", "Buterfly", "Butterfli", "Butrfly"], 0, "Butterfly মানে প্রজাপতি।", "emoji:🦋"),
    q("স্কুলের সঠিক বানান কোনটি?", ["Scool", "Skool", "School", "Shcool"], 2, "School—এখানে আমরা শিখি!", "emoji:🏫"),
    q("Elephant শব্দের অর্থ কী?", ["বাঘ", "জিরাফ", "ঘোড়া", "হাতি"], 3, "Elephant মানে হাতি।", "emoji:🐘"),
    q("বন্ধুর ইংরেজি বানান কোনটি?", ["Freind", "Friend", "Frend", "Freiend"], 1, "Friend মানে বন্ধু।", "number:F R I E N D"),
  ],
  "solar-system": [
    q("আমরা কোন গ্রহে বাস করি?", ["মঙ্গল", "পৃথিবী", "শুক্র", "শনি"], 1, "পৃথিবী আমাদের বাসস্থান।", "emoji:🌍"),
    q("সূর্য আসলে কী?", ["গ্রহ", "উপগ্রহ", "নক্ষত্র", "ধূমকেতু"], 2, "সূর্য একটি নক্ষত্র, সে আলো ও তাপ দেয়।", "emoji:☀️"),
    q("পৃথিবীর প্রাকৃতিক উপগ্রহ কোনটি?", ["চাঁদ", "মঙ্গল", "সূর্য", "শুক্র"], 0, "চাঁদ পৃথিবীর চারদিকে ঘোরে।", "emoji:🌙"),
    q("সৌরজগতে মোট কয়টি গ্রহ আছে?", ["৬", "৭", "৯", "৮"], 3, "সৌরজগতে ৮টি গ্রহ আছে।", "emoji:🪐"),
    q("কোন গ্রহকে লাল গ্রহ বলা হয়?", ["বৃহস্পতি", "মঙ্গল", "শনি", "বুধ"], 1, "মঙ্গলের মাটিতে লোহার অক্সাইড থাকায় লাল দেখায়।", "emoji:🔴"),
  ],
};
export const getQuestions = (gameId: string) => questionBank[gameId] ?? questionBank["number-garden"];
