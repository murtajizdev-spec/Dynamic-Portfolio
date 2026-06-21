import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, featured } = req.query;
    const conditions = [];
    if (category) conditions.push(eq(blogPostsTable.category, category as string));
    if (featured !== undefined) conditions.push(eq(blogPostsTable.featured, featured === "true"));
    const rows = conditions.length
      ? await db.select().from(blogPostsTable).where(and(...conditions)).orderBy(desc(blogPostsTable.createdAt))
      : await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt));
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list blog posts");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const inserted = await db.insert(blogPostsTable).values(req.body).returning();
    return res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create blog post");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const rows = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, id));
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get blog post");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await db.update(blogPostsTable).set(req.body).where(eq(blogPostsTable.id, id)).returning();
    if (!updated.length) return res.status(404).json({ error: "Not found" });
    return res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update blog post");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete blog post");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
