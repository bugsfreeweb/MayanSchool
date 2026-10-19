import type { NextConfig } from "next";

/*
  Mayan School — Next.js configuration
  ---------------------------------------------------------------
  One codebase, two runtimes:

  • Node (default): `npm run build` + `npm run start`.
  • Cloudflare Workers (SSR via @opennextjs/cloudflare):
    `npm run deploy` / `npm run preview`.

  The Cloudflare adapter keeps the API routes and database access intact,
  so no architecture change is needed to host on Cloudflare.
*/

const nextConfig: NextConfig = {
  // Keep the PostgreSQL driver out of the serverless/edge bundle. The Workers
  // runtime uses Turso/libSQL and never imports `pg`, so leaving it external
  // prevents `pg-cloudflare` from breaking the OpenNext/esbuild build.
  serverExternalPackages: ["pg", "pg-cloudflare"],
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
