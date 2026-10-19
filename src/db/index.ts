import { drizzle as postgresDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as tursoDrizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { Pool } from "pg";
import type { SQL } from "drizzle-orm";

// The sandbox uses PostgreSQL. Set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN on Vercel.
const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
export const databaseProvider = tursoUrl ? "turso" : "postgresql";
const globalDb = globalThis as typeof globalThis & { mayanPool?: Pool };
const pool = tursoUrl ? null : globalDb.mayanPool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (pool) globalDb.mayanPool = pool;
const postgres = pool ? postgresDrizzle(pool) : null;
const turso = tursoUrl ? tursoDrizzle(createClient({ url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN || undefined })) : null;

export interface Executor {
  execute<T extends Record<string, unknown> = Record<string, unknown>>(query: SQL): Promise<{ rows: T[] }>;
}
export const db: Executor & { transaction<T>(work: (tx: Executor) => Promise<T>): Promise<T> } = {
  async execute<T extends Record<string, unknown>>(query: SQL) {
    if (turso) return { rows: await turso.all<T>(query) };
    if (!postgres) throw new Error("Configure DATABASE_URL or TURSO_DATABASE_URL");
    return { rows: (await postgres.execute(query)).rows as T[] };
  },
  async transaction<T>(work: (tx: Executor) => Promise<T>): Promise<T> {
    if (turso) return turso.transaction(async (tx) => work({ execute: async <R extends Record<string, unknown>>(query: SQL) => ({ rows: await tx.all<R>(query) }) }));
    if (!postgres) throw new Error("Configure DATABASE_URL or TURSO_DATABASE_URL");
    return postgres.transaction(async (tx) => work({ execute: async <R extends Record<string, unknown>>(query: SQL) => ({ rows: (await tx.execute(query)).rows as R[] }) }));
  },
};
export const databaseBoolean = (value: boolean) => databaseProvider === "turso" ? Number(value) : value;
