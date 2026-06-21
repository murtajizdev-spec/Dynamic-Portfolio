import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const educationTable = pgTable("education", {
  id: serial("id").primaryKey(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  description: text("description"),
  logoUrl: text("logo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEducationSchema = createInsertSchema(educationTable).omit({ id: true, createdAt: true });
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof educationTable.$inferSelect;
