import { Router, type IRouter } from "express";
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

const router: IRouter = Router();

router.use(healthRouter);
router.use("/hero", heroRouter);
router.use("/about", aboutRouter);
router.use("/skills", skillsRouter);
router.use("/projects", projectsRouter);
router.use("/services", servicesRouter);
router.use("/experience", experienceRouter);
router.use("/education", educationRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/blog", blogRouter);
router.use("/contact", contactRouter);
router.use("/settings", settingsRouter);
router.use("/dashboard", dashboardRouter);

export default router;
