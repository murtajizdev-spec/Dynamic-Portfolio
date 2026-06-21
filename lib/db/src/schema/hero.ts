import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const heroTable = pgTable("hero", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  bio: text("bio").notNull(),
  ctaPrimary: text("cta_primary").notNull().default("View My Work"),
  ctaSecondary: text("cta_secondary").notNull().default("Contact Me"),
  avatarUrl: text("avatar_url").notNull().default(""),
  resumeUrl: text("resume_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertHeroSchema = createInsertSchema(heroTable).omit({ id: true, updatedAt: true });
export type InsertHero = z.infer<typeof insertHeroSchema>;
export type Hero = typeof heroTable.$inferSelect;
