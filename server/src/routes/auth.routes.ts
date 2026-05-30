import { Router } from "express";
import * as ctrl from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { registerSchema, loginSchema } from "../validators";

const router = Router();

router.post("/register", validate(registerSchema), ctrl.register);
router.post("/login", validate(loginSchema), ctrl.login);
router.post("/logout", ctrl.logout);
router.get("/me", authenticate, ctrl.me);

export default router;
