import { Router } from "express";
import { db } from "@workspace/db";
import { heroTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(heroTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(heroTable).values({
        name: "Alex Johnson",
        title: "Full-Stack Developer",
        subtitle: "Building digital experiences that matter",
        bio: "Passionate developer crafting beautiful, performant web applications with modern technologies.",
        ctaPrimary: "View My Work",
        ctaSecondary: "Contact Me",
        avatarUrl: "",
        resumeUrl: null,
      }).returning();
      return res.json(inserted[0]);
    }
    return res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get hero");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/", async (req, res) => {
  try {
    const rows = await db.select().from(heroTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(heroTable).values(req.body).returning();
      return res.json(inserted[0]);
    }
    const updated = await db.update(heroTable).set(req.body).where(eq(heroTable.id, rows[0].id)).returning();
    return res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update hero");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
