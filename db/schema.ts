import { pgTable, varchar, uuid, boolean, bigint, timestamp, text } from "drizzle-orm/pg-core";

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

export const chatsTable = pgTable("chats", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: varchar({ length: 255 }).default('New Chat'),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  chatId: uuid().notNull().references(() => chatsTable.id, { onDelete: "cascade" }),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  question: text(),
  query: text(),
  queryResults: text(),
  textualResponse: text(),
  errorMessage: text(),
  // Whether the engine has been fetched or show loading state while fetching
  isLoading: boolean().notNull().default(true),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});