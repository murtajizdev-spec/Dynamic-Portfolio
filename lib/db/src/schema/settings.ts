import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteTitle: text("site_title").notNull().default("Portfolio"),
  siteDescription: text("site_description").notNull().default(""),
  siteUrl: text("site_url").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone"),
  address: text("address"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  instagramUrl: text("instagram_url"),
  youtubeUrl: text("youtube_url"),
  faviconUrl: text("favicon_url"),
  ogImageUrl: text("og_image_url"),
  googleAnalyticsId: text("google_analytics_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true, updatedAt: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
