import type { Request, Response } from "express";
import { Comment } from "../models/comment.model";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

/** GET /posts/:postId/comments */
export const listComments = asyncHandler(async (req: Request, res: Response) => {
  const comments = await Comment.findAll({
    where: { postId: Number(req.params.postId) },
    include: [{ model: User, as: "author", attributes: ["id", "name", "avatarUrl"] }],
    order: [["createdAt", "DESC"]],
  });
  res.json({ success: true, data: comments });
});

/** POST /posts/:postId/comments */
export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const post = await Post.findByPk(Number(req.params.postId));
  if (!post) throw ApiError.notFound("Post tidak ditemukan");

  const { body } = req.body as { body: string };
  const comment = await Comment.create({ body, postId: post.id, authorId: req.user!.sub });
  res.status(201).json({ success: true, data: comment });
});

/** DELETE /comments/:id */
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const comment = await Comment.findByPk(Number(req.params.id));
  if (!comment) throw ApiError.notFound("Komentar tidak ditemukan");

  const isOwner = comment.authorId === req.user!.sub;
  if (!isOwner && req.user!.role !== "admin") throw ApiError.forbidden();

  await comment.destroy();
  res.json({ success: true, message: "Komentar dihapus" });
});
