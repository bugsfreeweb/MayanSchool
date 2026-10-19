import { pgTable, text, integer, boolean, timestamp, uuid, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import type { Subject, GameKind } from "@/lib/content";

export const games = pgTable("games", {
  id: text("id").primaryKey(), title: text("title").notNull(), description: text("description").notNull(),
  subject: text("subject").$type<Subject>().notNull(),
  minAge: integer("min_age").notNull().default(4), maxAge: integer("max_age").notNull().default(10),
  duration: integer("duration").notNull().default(5), difficulty: text("difficulty").notNull().default("সহজ"),
  thumbnail: text("thumbnail").notNull(), kind: text("kind").$type<GameKind>().notNull().default("quiz"), entryPath: text("entry_path"),
  published: boolean("published").notNull().default(true), featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const gameAssets = pgTable("game_assets", {
  id: uuid("id").defaultRandom().primaryKey(), gameId: text("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  path: text("path").notNull(), content: text("content").notNull(), contentType: text("content_type").notNull(), size: integer("size").notNull(),
}, (table) => [uniqueIndex("game_asset_path_idx").on(table.gameId, table.path)]);
export const learners = pgTable("learners", {
  id: uuid("id").defaultRandom().primaryKey(), name: text("name").notNull().default("আনিকা"), age: integer("age").notNull().default(6),
  dailyGoal: integer("daily_goal").notNull().default(15), createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const favorites = pgTable("favorites", {
  learnerId: uuid("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
  gameId: text("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
}, (table) => [primaryKey({ columns: [table.learnerId, table.gameId] })]);
export const attempts = pgTable("attempts", {
  id: uuid("id").defaultRandom().primaryKey(), learnerId: uuid("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
  gameId: text("game_id").notNull().references(() => games.id, { onDelete: "cascade" }), correct: integer("correct").notNull(),
  total: integer("total").notNull(), stars: integer("stars").notNull(), duration: integer("duration").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});
