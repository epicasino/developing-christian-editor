import { relations } from 'drizzle-orm';
import { text, uuid, date, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
