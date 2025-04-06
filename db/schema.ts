import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  githubId: varchar({ length: 255 }).unique(),
  googleId: varchar({ length: 255 }).unique(),
  name: varchar({ length: 255 }).notNull(),
  avatarUrl: varchar({ length: 255 }).notNull(),
});