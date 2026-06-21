import { Router } from "express";
import { db } from "@workspace/db";
import {
  projectsTable,
  blogPostsTable,
  contactMessagesTable,
  skillsTable,
  testimonialsTable,
  servicesTable,
  experienceTable,
} from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const [
      projectCount,
      blogCount,
      messageCount,
      unreadCount,
      skillCount,
      testimonialCount,
      serviceCount,
      experienceCount,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(projectsTable),
      db.select({ count: sql<number>`count(*)` }).from(blogPostsTable),
      db.select({ count: sql<number>`count(*)` }).from(contactMessagesTable),
      db.select({ count: sql<number>`count(*)` }).from(contactMessagesTable).where(eq(contactMessagesTable.read, false)),
      db.select({ count: sql<number>`count(*)` }).from(skillsTable),
      db.select({ count: sql<number>`count(*)` }).from(testimonialsTable),
      db.select({ count: sql<number>`count(*)` }).from(servicesTable),
      db.select({ count: sql<number>`count(*)` }).from(experienceTable),
    ]);

    return res.json({
      totalProjects: Number(projectCount[0].count),
      totalBlogPosts: Number(blogCount[0].count),
      totalMessages: Number(messageCount[0].count),
      unreadMessages: Number(unreadCount[0].count),
      totalSkills: Number(skillCount[0].count),
      totalTestimonials: Number(testimonialCount[0].count),
      totalServices: Number(serviceCount[0].count),
      totalExperience: Number(experienceCount[0].count),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/recent-messages", async (req, res) => {
  try {
    const rows = await db.select().from(contactMessagesTable).orderBy(desc(contactMessagesTable.createdAt)).limit(5);
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to get recent messages");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/featured-projects", async (req, res) => {
  try {
    const rows = await db.select().from(projectsTable).where(eq(projectsTable.featured, true)).limit(6);
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to get featured projects");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
