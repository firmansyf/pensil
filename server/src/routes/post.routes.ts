import { Router } from "express";
import * as ctrl from "../controllers/post.controller";
import * as commentCtrl from "../controllers/comment.controller";
import { validate } from "../middleware/validate.middleware";
import { authenticate, authorize, optionalAuth } from "../middleware/auth.middleware";
import {
  createPostSchema,
  updatePostSchema,
  listPostsQuerySchema,
  createCommentSchema,
} from "../validators";

const router = Router();

// Publik (optionalAuth agar admin bisa lihat draft)
router.get("/", optionalAuth, validate(listPostsQuerySchema, "query"), ctrl.listPosts);
// Ambil per-id (untuk edit) — harus sebelum "/:slug" agar tidak tertangkap.
router.get("/id/:id", authenticate, authorize("admin", "author"), ctrl.getPostById);
router.get("/:slug", optionalAuth, ctrl.getPostBySlug);

// Komentar (nested)
router.get("/:postId/comments", commentCtrl.listComments);
router.post(
  "/:postId/comments",
  authenticate,
  validate(createCommentSchema),
  commentCtrl.createComment,
);

// Admin / author
router.post(
  "/",
  authenticate,
  authorize("admin", "author"),
  validate(createPostSchema),
  ctrl.createPost,
);
router.patch(
  "/:id",
  authenticate,
  authorize("admin", "author"),
  validate(updatePostSchema),
  ctrl.updatePost,
);
router.delete("/:id", authenticate, authorize("admin", "author"), ctrl.deletePost);

export default router;
