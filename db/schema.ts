import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  githubId: varchar({ length: 255 }).unique(),
  googleId: varchar({ length: 255 }).unique(),
  name: varchar({ length: 255 }).notNull(),
  avatarUrl: varchar({ length: 255 }).notNull(),
});