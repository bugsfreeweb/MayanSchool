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

const nextConfig: NextConfig = {};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
