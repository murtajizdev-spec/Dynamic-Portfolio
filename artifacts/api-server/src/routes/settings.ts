import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(siteSettingsTable).values({
        siteTitle: "Alex Johnson — Full-Stack Developer",
        siteDescription: "Portfolio of Alex Johnson, a full-stack developer building modern web applications.",
        siteUrl: "",
        email: "alex@example.com",
        githubUrl: "https://github.com",
        linkedinUrl: "https://linkedin.com",
      }).returning();
      return res.json(inserted[0]);
    }
    return res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get settings");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/", async (req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(siteSettingsTable).values(req.body).returning();
      return res.json(inserted[0]);
    }
    const updated = await db.update(siteSettingsTable).set(req.body).where(eq(siteSettingsTable.id, rows[0].id)).returning();
    return res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update settings");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
