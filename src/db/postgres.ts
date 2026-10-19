import { drizzle as postgresDrizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { SQL } from "drizzle-orm";
import type { Database, Executor } from "@/db/types";

/*
  PostgreSQL backend — kept in its own module so the Cloudflare Workers
  bundle can exclude it. `src/db/index.ts` imports this file dynamically
  only when TURSO_DATABASE_URL is unset, so `pg` (and `pg-cloudflare`)
  never reach the Workers/Turso build.
*/

const globalDb = globalThis as typeof globalThis & { mayanPool?: Pool };
const pool = globalDb.mayanPool ?? new Pool({ connectionString: process.env.DATABASE_URL });
globalDb.mayanPool = pool;
const postgres = postgresDrizzle(pool);

export const postgresExecutor: Database = {
  async execute<T extends Record<string, unknown>>(query: SQL) {
    return { rows: (await postgres.execute(query)).rows as T[] };
  },
  async transaction<T>(work: (tx: Executor) => Promise<T>): Promise<T> {
    return postgres.transaction(async (tx) =>
      work({
        execute: async <R extends Record<string, unknown>>(query: SQL) => ({
          rows: (await tx.execute(query)).rows as R[],
        }),
      }),
    );
  },
};
