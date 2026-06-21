import { Router } from "express";
import { db } from "@workspace/db";
import { educationTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

function sanitize(body: Record<string, unknown>) {
  const { id, updatedAt, createdAt, ...rest } = body;
  void id; void updatedAt; void createdAt;
  return rest;
}

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
    const data = sanitize(req.body);
    const inserted = await db.insert(educationTable).values(data as never).returning();
    return res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create education");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = sanitize(req.body);
    const updated = await db.update(educationTable).set(data).where(eq(educationTable.id, id)).returning();
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
