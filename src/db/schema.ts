import { text, uuid, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  image: text('image'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
