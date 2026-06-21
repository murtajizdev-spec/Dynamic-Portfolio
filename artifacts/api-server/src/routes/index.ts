import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import healthRouter from "./health";
import heroRouter from "./hero";
import aboutRouter from "./about";
import skillsRouter from "./skills";
import projectsRouter from "./projects";
import servicesRouter from "./services";
import experienceRouter from "./experience";
import educationRouter from "./education";
import testimonialsRouter from "./testimonials";
import blogRouter from "./blog";
import contactRouter from "./contact";
import settingsRouter from "./settings";
import dashboardRouter from "./dashboard";
import authRouter from "./auth";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session.authenticated) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

function requireAuthForWrites(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }
  return requireAuth(req, res, next);
}

router.use(healthRouter);
router.use("/auth", authRouter);

router.use("/hero", requireAuthForWrites, heroRouter);
router.use("/about", requireAuthForWrites, aboutRouter);
router.use("/skills", requireAuthForWrites, skillsRouter);
router.use("/projects", requireAuthForWrites, projectsRouter);
router.use("/services", requireAuthForWrites, servicesRouter);
router.use("/experience", requireAuthForWrites, experienceRouter);
router.use("/education", requireAuthForWrites, educationRouter);
router.use("/testimonials", requireAuthForWrites, testimonialsRouter);
router.use("/blog", requireAuthForWrites, blogRouter);
router.use("/contact", requireAuthForWrites, contactRouter);
router.use("/settings", requireAuthForWrites, settingsRouter);
router.use("/dashboard", requireAuth, dashboardRouter);

export default router;
