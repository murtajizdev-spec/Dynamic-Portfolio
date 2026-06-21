import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function sanitize(body: Record<string, unknown>) {
  const { id, updatedAt, createdAt, ...rest } = body;
  void id; void updatedAt; void createdAt;
  return rest;
}

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
    const data = sanitize(req.body);
    const rows = await db.select().from(siteSettingsTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(siteSettingsTable).values(data as never).returning();
      return res.json(inserted[0]);
    }
    const updated = await db.update(siteSettingsTable).set(data).where(eq(siteSettingsTable.id, rows[0].id)).returning();
    return res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update settings");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
