import { pgTable, varchar, uuid, boolean, bigint } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  githubId: varchar({ length: 255 }).unique(),
  googleId: varchar({ length: 255 }).unique(),
  name: varchar({ length: 255 }).notNull(),
  avatarUrl: varchar({ length: 255 }).notNull(),
});

export const sessionsTable = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: "cascade" }),
});

export const tokensTable = pgTable("tokens", {
  id: uuid().primaryKey().defaultRandom(),
  sessionId: uuid().notNull().references(() => sessionsTable.id, { onDelete: "cascade" }),
  jti: varchar({ length: 255 }).notNull(),
  exp: bigint({ mode: "number" }).notNull(),
  isBlacklisted: boolean().notNull().default(false),
});