import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const experienceTable = pgTable("experience", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),
  description: text("description").notNull(),
  current: boolean("current").notNull().default(false),
  companyUrl: text("company_url"),
  logoUrl: text("logo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertExperienceSchema = createInsertSchema(experienceTable).omit({ id: true, createdAt: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experienceTable.$inferSelect;
