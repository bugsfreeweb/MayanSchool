import { NextResponse } from "next/server";
import { saveUploadedGame } from "@/db/repository";
import { getGames, isAdmin } from "@/lib/server";
import { subjects, type Subject, type Game } from "@/lib/content";
import { unzipSync } from "fflate";
import { randomUUID } from "node:crypto";
import { extname } from "node:path";

const mimeTypes: Record<string, string> = { ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg", ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".txt": "text/plain" };
export async function GET(request: Request) {
  const includeDrafts = new URL(request.url).searchParams.get("admin") === "1" && await isAdmin();
  return NextResponse.json({ games: await getGames(includeDrafts) });
}
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "অ্যাডমিন হিসেবে প্রবেশ করুন।" }, { status: 401 });
  try {
    if (Number(request.headers.get("content-length") || 0) > 4.3 * 1024 * 1024) throw new Error("আপলোড সর্বোচ্চ ৩ MB হতে পারে।");
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size) throw new Error("একটি HTML অথবা ZIP গেম আপলোড করুন।");
    if (file.size > 3 * 1024 * 1024) throw new Error("গেম ফাইল সর্বোচ্চ ৩ MB হতে পারে।");
    const extension = extname(file.name).toLowerCase();
    if (![".html", ".htm", ".zip"].includes(extension)) throw new Error("শুধু HTML ও ZIP ফাইল গ্রহণযোগ্য।");
    let files: Record<string, Uint8Array>;
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (extension === ".zip") {
      let expanded = 0, count = 0;
      files = unzipSync(bytes, { filter: (entry) => {
        if (entry.name.endsWith("/") || entry.name.startsWith("__MACOSX/") || entry.name.includes("/.")) return false;
        if (!Number.isFinite(entry.originalSize) || entry.originalSize > 3 * 1024 * 1024) throw new Error("ZIP-এর প্রতিটি ফাইল ৩ MB-এর ছোট হতে হবে।");
        expanded += entry.originalSize;
        if (expanded > 20 * 1024 * 1024 || ++count > 300) throw new Error("ZIP সর্বোচ্চ ৩০০ ফাইল ও ২০ MB হতে পারে।");
        return true;
      } });
    } else files = { "index.html": bytes };
    const paths = Object.keys(files);
    if (paths.some((path) => path.startsWith("/") || path.includes("\\") || path.split("/").includes("..") || path.length > 220)) throw new Error("ZIP-এ অনিরাপদ ফাইল পাথ আছে।");
    const entryPath = paths.filter((path) => /(^|\/)index\.html?$/i.test(path)).sort((a, b) => a.length - b.length)[0];
    if (!entryPath) throw new Error("ZIP ফাইলে index.html থাকতে হবে।");
    const subject = String(form.get("subject") || "bangla") as Subject;
    const title = String(form.get("title") || file.name.replace(/\.(zip|html?)$/i, "").replace(/[-_]/g, " ")).trim();
    const description = String(form.get("description") || "খেলতে খেলতে নতুন কিছু শিখি।").trim();
    const minAge = Number(form.get("minAge") || 4), maxAge = Number(form.get("maxAge") || 10), duration = Number(form.get("duration") || 5);
    const difficulty = String(form.get("difficulty") || "সহজ");
    if (!subjects.some((s) => s.id === subject) || !title || title.length > 100 || description.length > 300 || !Number.isInteger(minAge) || !Number.isInteger(maxAge) || minAge < 3 || maxAge > 10 || minAge > maxAge || !Number.isInteger(duration) || duration < 1 || duration > 30 || !["সহজ", "মাঝারি", "চ্যালেঞ্জ"].includes(difficulty)) throw new Error("গেমের শিরোনাম, বিষয়, বয়স ও সময় সঠিকভাবে দিন।");
    const id = randomUUID();
    let thumbnail = `/images/${subject === "math" ? "number-garden" : subject === "english" ? "alphabet-adventure" : subject === "science" ? "science-lab" : "creative-world"}.png`;
    if (subject === "bangla") thumbnail = "/images/bangla-garden.svg";
    const cover = form.get("cover");
    if (cover instanceof File && cover.size) {
      if (cover.size > 1 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp"].includes(cover.type)) throw new Error("কভার ছবি PNG, JPG বা WebP এবং সর্বোচ্চ ১ MB হতে হবে।");
      const coverPath = `_mayan_cover${cover.type === "image/png" ? ".png" : cover.type === "image/webp" ? ".webp" : ".jpg"}`;
      files[coverPath] = new Uint8Array(await cover.arrayBuffer());
      thumbnail = `/api/game-files/${id}/${coverPath}`;
    }
    const record: Game = { id, title, description, subject, minAge, maxAge, duration, difficulty, thumbnail, kind: "upload", entryPath, published: form.get("published") !== "false", featured: false };
    const assets = Object.entries(files).filter(([path]) => !path.endsWith("/")).map(([path, data]) => ({ gameId: id, path, content: Buffer.from(data).toString("base64"), contentType: mimeTypes[extname(path).toLowerCase()] || "application/octet-stream", size: data.length }));
    if (!assets.length) throw new Error("গেম ফাইল খালি।");
    const game = await saveUploadedGame(record, assets);
    return NextResponse.json({ game }, { status: 201 });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json({ error: error instanceof Error && !error.message.includes("query") ? error.message : "আপলোড সম্পন্ন হয়নি। আবার চেষ্টা করুন।" }, { status: 400 });
  }
}
