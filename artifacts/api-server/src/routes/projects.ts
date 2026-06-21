import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = db.select().from(projectsTable);
    const conditions = [];
    if (category) conditions.push(eq(projectsTable.category, category as string));
    if (featured !== undefined) conditions.push(eq(projectsTable.featured, featured === "true"));
    if (conditions.length) {
      const rows = await db.select().from(projectsTable).where(and(...conditions)).orderBy(asc(projectsTable.sortOrder), asc(projectsTable.id));
      return res.json(rows);
    }
    const rows = await query.orderBy(asc(projectsTable.sortOrder), asc(projectsTable.id));
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list projects");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const inserted = await db.insert(projectsTable).values(req.body).returning();
    return res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create project");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const rows = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get project");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await db.update(projectsTable).set(req.body).where(eq(projectsTable.id, id)).returning();
    if (!updated.length) return res.status(404).json({ error: "Not found" });
    return res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update project");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(projectsTable).where(eq(projectsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete project");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
