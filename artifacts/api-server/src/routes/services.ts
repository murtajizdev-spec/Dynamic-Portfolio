import { Router } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder), asc(servicesTable.id));
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list services");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const inserted = await db.insert(servicesTable).values(req.body).returning();
    return res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create service");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await db.update(servicesTable).set(req.body).where(eq(servicesTable.id, id)).returning();
    if (!updated.length) return res.status(404).json({ error: "Not found" });
    return res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update service");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete service");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
