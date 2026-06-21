import { Router } from "express";
import { db } from "@workspace/db";
import { educationTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(educationTable).orderBy(asc(educationTable.sortOrder), asc(educationTable.id));
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list education");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const inserted = await db.insert(educationTable).values(req.body).returning();
    return res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create education");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await db.update(educationTable).set(req.body).where(eq(educationTable.id, id)).returning();
    if (!updated.length) return res.status(404).json({ error: "Not found" });
    return res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update education");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(educationTable).where(eq(educationTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete education");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
