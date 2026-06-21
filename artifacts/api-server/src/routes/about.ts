import { Router } from "express";
import { db } from "@workspace/db";
import { aboutTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(aboutTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(aboutTable).values({
        bio: "I'm a passionate full-stack developer with a love for creating elegant solutions to complex problems. I specialize in building modern web applications that are fast, accessible, and visually stunning.",
        profileImageUrl: "",
        location: "San Francisco, CA",
        email: "alex@example.com",
        phone: null,
        yearsExperience: 5,
        projectsCompleted: 50,
        happyClients: 30,
      }).returning();
      return res.json(inserted[0]);
    }
    return res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get about");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/", async (req, res) => {
  try {
    const rows = await db.select().from(aboutTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(aboutTable).values(req.body).returning();
      return res.json(inserted[0]);
    }
    const updated = await db.update(aboutTable).set(req.body).where(eq(aboutTable.id, rows[0].id)).returning();
    return res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update about");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
