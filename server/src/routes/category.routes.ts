import { Router } from "express";
import * as ctrl from "../controllers/category.controller";
import { validate } from "../middleware/validate.middleware";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { createCategorySchema, updateCategorySchema } from "../validators";

const router = Router();

router.get("/", ctrl.listCategories);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCategorySchema),
  ctrl.createCategory,
);
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateCategorySchema),
  ctrl.updateCategory,
);
router.delete("/:id", authenticate, authorize("admin"), ctrl.deleteCategory);

export default router;
