import { Router } from "express";
import authRoutes from "./auth.routes";
import postRoutes from "./post.routes";
import categoryRoutes from "./category.routes";
import commentRoutes from "./comment.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok", uptime: process.uptime() });
});

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/categories", categoryRoutes);
router.use("/comments", commentRoutes);

export default router;
