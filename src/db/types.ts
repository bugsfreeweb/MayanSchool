import type { SQL } from "drizzle-orm";

export interface Executor {
  execute<T extends Record<string, unknown> = Record<string, unknown>>(query: SQL): Promise<{ rows: T[] }>;
}

export interface Database extends Executor {
  transaction<T>(work: (tx: Executor) => Promise<T>): Promise<T>;
}
