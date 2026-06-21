import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aboutTable = pgTable("about", {
  id: serial("id").primaryKey(),
  bio: text("bio").notNull(),
  profileImageUrl: text("profile_image_url").notNull().default(""),
  location: text("location").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone"),
  yearsExperience: integer("years_experience").notNull().default(0),
  projectsCompleted: integer("projects_completed").notNull().default(0),
  happyClients: integer("happy_clients").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAboutSchema = createInsertSchema(aboutTable).omit({ id: true, updatedAt: true });
export type InsertAbout = z.infer<typeof insertAboutSchema>;
export type About = typeof aboutTable.$inferSelect;
