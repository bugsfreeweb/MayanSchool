import { cp, mkdir, rm, writeFile, access, copyFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Packages the OpenNext Cloudflare Workers build output as a Cloudflare
 * Pages deployment directory (advanced mode).
 *
 * OpenNext's `worker.js` is a module worker that imports sibling files at
 * relative paths (./cloudflare/*, ./server-functions/*, ./.build/*). Pages
 * serves an output directory, so the whole `.open-next` tree is copied in
 * and the worker entry is renamed to `_worker.js` at the root, keeping all
 * relative imports resolvable.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const openNext = join(root, ".open-next");
const out = join(root, "pages-dist");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const worker = join(openNext, "worker.js");
  if (!(await exists(worker))) {
    throw new Error(
      "Missing .open-next/worker.js — run `npx opennextjs-cloudflare build` first.",
    );
  }

  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  // Copy every OpenNext artifact (worker chunks, server-functions, .build,
  // cloudflare helpers, middleware) so relative imports resolve.
  for (const entry of ["cloudflare", "middleware", "server-functions", ".build", "dynamodb-provider"]) {
    const src = join(openNext, entry);
    if (await exists(src)) await cp(src, join(out, entry), { recursive: true });
  }

  // Static Next.js assets live at the output root.
  const assets = join(openNext, "assets");
  if (await exists(assets)) await cp(assets, out, { recursive: true });

  // Page Functions entry point.
  await copyFile(worker, join(out, "_worker.js"));

  // Route requests through the worker; Pages serves /_next/static directly.
  const routes = {
    version: 1,
    include: ["/*"],
    exclude: ["/_next/static/*"],
  };
  await writeFile(join(out, "_routes.json"), JSON.stringify(routes, null, 2) + "\n", "utf8");

  console.log(`Pages output ready at ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
