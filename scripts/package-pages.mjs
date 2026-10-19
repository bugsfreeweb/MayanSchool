import { cp, mkdir, readFile, rm, writeFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Packages the OpenNext Cloudflare Workers build output as a
 * Cloudflare Pages deployment directory (advanced mode):
 *
 *   pages-dist/
 *     _worker.js        <- OpenNext worker (module syntax, fetch handler)
 *     _routes.json      <- route all requests through the worker
 *     <static assets>   <- copied from .open-next/assets
 *
 * This lets the same build be served from a Pages project
 * (e.g. https://mayanschool.pages.dev) in addition to a Worker.
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
  const assets = join(openNext, "assets");

  if (!(await exists(worker))) {
    throw new Error(
      "Missing .open-next/worker.js — run `npx opennextjs-cloudflare build` first.",
    );
  }

  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  if (await exists(assets)) {
    await cp(assets, out, { recursive: true });
  }

  const workerSource = await readFile(worker, "utf8");
  await writeFile(join(out, "_worker.js"), workerSource, "utf8");

  // Route every request through the worker except Next static assets,
  // which Pages serves directly from the deployment.
  const routes = {
    version: 1,
    include: ["/*"],
    exclude: ["/_next/static/*", "/favicon.ico"],
  };
  await writeFile(
    join(out, "_routes.json"),
    JSON.stringify(routes, null, 2) + "\n",
    "utf8",
  );

  console.log(`Pages output ready at ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
