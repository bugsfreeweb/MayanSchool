import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/*
  OpenNext Cloudflare adapter configuration.
  A minimal setup: no ISR incremental cache / R2 bucket is required
  because Mayan School serves dynamic content per request. Add an R2
  incremental cache later if ISR is introduced.
*/
export default defineCloudflareConfig({});
