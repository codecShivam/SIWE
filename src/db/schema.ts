import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

// users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletAddress: varchar('wallet_address', { length: 42 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

// sessions table
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: varchar('session_id', { length: 64 }).notNull().unique(),
  nonce: varchar('nonce', { length: 64 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert; 