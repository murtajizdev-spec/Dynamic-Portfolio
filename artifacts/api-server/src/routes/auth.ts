import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env["ADMIN_PASSWORD"];

  if (!adminPassword) {
    req.log.error("ADMIN_PASSWORD environment variable is not set");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  req.session.authenticated = true;
  return res.json({ ok: true });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  res.json({ authenticated: req.session.authenticated === true });
});

export default router;
