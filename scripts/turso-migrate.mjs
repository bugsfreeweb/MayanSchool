import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sql } from 'drizzle-orm';
if (!process.env.TURSO_DATABASE_URL) throw new Error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before migrating.');
const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN || undefined });
const database = drizzle(client);
try {
  const migration = await readFile(new URL('../migrations/turso/001_initial.sql', import.meta.url), 'utf8');
  for (const statement of migration.split(';').map(s => s.trim()).filter(Boolean)) await database.run(sql.raw(statement));
  console.log('Mayan School: Turso schema is ready. Built-in games seed on the first library request.');
} finally { client.close(); }
