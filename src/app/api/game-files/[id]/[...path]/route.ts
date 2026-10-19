import { getAsset } from "@/db/repository";
import { isAdmin } from "@/lib/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; path: string[] }> }) {
  const { id, path } = await params;
  if (path.some((part) => part === ".." || part.includes("\\"))) return new Response("Invalid path", { status: 400 });
  const result = await getAsset(id, path.join("/"));
  if (!result || (!result.published && !(await isAdmin()))) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(Buffer.from(result.content, "base64")), { headers: {
    "Content-Type": result.contentType,
    "X-Content-Type-Options": "nosniff",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "private, max-age=300",
    "Content-Security-Policy": "sandbox allow-scripts; default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; form-action 'none'; frame-ancestors 'self'; base-uri 'none'",
  } });
}
