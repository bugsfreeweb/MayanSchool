import { drizzle as tursoDrizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import type { SQL } from "drizzle-orm";
import type { Database, Executor } from "@/db/types";

/*
  Dual backend:
  • Turso/libSQL when TURSO_DATABASE_URL is set (used by Cloudflare Workers,
    where PostgreSQL is unreachable).
  • PostgreSQL otherwise (local preview).

  The PostgreSQL client lives in `src/db/postgres.ts` and is imported
  dynamically so `pg` / `pg-cloudflare` are excluded from the Workers bundle
  produced by @opennextjs/cloudflare.
*/

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
export const databaseProvider = tursoUrl ? "turso" : "postgresql";
const turso = tursoUrl
  ? tursoDrizzle(createClient({ url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN || undefined }))
  : null;

type PostgresModule = typeof import("@/db/postgres");
let postgresModule: Promise<PostgresModule> | null = null;
const loadPostgres = () => {
  if (!postgresModule) postgresModule = import("@/db/postgres");
  return postgresModule;
};

export type { Executor } from "@/db/types";
export const db: Database = {
  async execute<T extends Record<string, unknown>>(query: SQL) {
    if (turso) return { rows: await turso.all<T>(query) };
    const { postgresExecutor } = await loadPostgres();
    return postgresExecutor.execute<T>(query);
  },
  async transaction<T>(work: (tx: Executor) => Promise<T>): Promise<T> {
    if (turso) return turso.transaction(async (tx) => work({ execute: async <R extends Record<string, unknown>>(query: SQL) => ({ rows: await tx.all<R>(query) }) }));
    const { postgresExecutor } = await loadPostgres();
    return postgresExecutor.transaction(work);
  },
};
export const databaseBoolean = (value: boolean) => databaseProvider === "turso" ? Number(value) : value;
