import { Router } from "express";
import { db } from "@workspace/db";
import { contactMessagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(contactMessagesTable).orderBy(desc(contactMessagesTable.createdAt));
    return res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list contact messages");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const inserted = await db.insert(contactMessagesTable).values({
      ...req.body,
      read: false,
      replied: false,
    }).returning();
    return res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to send contact message");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await db.update(contactMessagesTable).set(req.body).where(eq(contactMessagesTable.id, id)).returning();
    if (!updated.length) return res.status(404).json({ error: "Not found" });
    return res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update contact message");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(contactMessagesTable).where(eq(contactMessagesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete contact message");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
