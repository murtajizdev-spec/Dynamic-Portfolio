import { Router } from "express";
import { db } from "@workspace/db";
import { testimonialsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

function sanitize(body: Record<string, unknown>) {
  const { id, updatedAt, createdAt, ...rest } = body;
  void id; void updatedAt; void createdAt;
  return rest;
}

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(testimonialsTable).orderBy(asc(testimonialsTable.sortOrder), asc(testimonialsTable.id));
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list testimonials");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = sanitize(req.body);
    const inserted = await db.insert(testimonialsTable).values(data as never).returning();
    return res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create testimonial");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = sanitize(req.body);
    const updated = await db.update(testimonialsTable).set(data).where(eq(testimonialsTable.id, id)).returning();
    if (!updated.length) return res.status(404).json({ error: "Not found" });
    return res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update testimonial");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete testimonial");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
