import { Router } from "express";
import * as ctrl from "../controllers/comment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.delete("/:id", authenticate, ctrl.deleteComment);

export default router;
