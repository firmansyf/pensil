import type { Request, Response } from "express";
import { Op, type WhereOptions } from "sequelize";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
import { Category } from "../models/category.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { uniqueSlug } from "../utils/slugify";
import type { CreatePostInput, UpdatePostInput } from "../validators";

const authorInclude = { model: User, as: "author", attributes: ["id", "name", "avatarUrl"] };
const categoryInclude = { model: Category, as: "category", attributes: ["id", "name", "slug"] };

/** GET /posts — daftar post (publik hanya yang published). */
export const listPosts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status, category, search } = req.query as unknown as {
    page: number;
    limit: number;
    status?: "draft" | "published";
    category?: string;
    search?: string;
  };

  const isAdmin = req.user?.role === "admin" || req.user?.role === "author";

  // Pengunjung publik hanya boleh melihat post published.
  const where: WhereOptions = {
    status: isAdmin && status ? status : "published",
  };

  if (search) {
    Object.assign(where, {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  const include: object[] = [authorInclude, categoryInclude];
  if (category) {
    include[1] = { ...categoryInclude, where: { slug: category } };
  }

  const { rows, count } = await Post.findAndCountAll({
    where,
    include,
    order: [
      ["publishedAt", "DESC"],
      ["createdAt", "DESC"],
    ],
    limit,
    offset: (page - 1) * limit,
    distinct: true,
  });

  res.json({
    success: true,
    data: rows,
    meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
  });
});

/** GET /posts/:slug — detail post berdasarkan slug. */
export const getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const post = await Post.findOne({
    where: { slug: String(req.params.slug) },
    include: [authorInclude, categoryInclude],
  });
  if (!post) throw ApiError.notFound("Post tidak ditemukan");

  const isAdmin = req.user?.role === "admin" || req.user?.role === "author";
  if (post.status !== "published" && !isAdmin) throw ApiError.notFound("Post tidak ditemukan");

  await post.increment("viewCount");
  res.json({ success: true, data: post });
});

/** GET /posts/id/:id — detail post berdasarkan id (untuk edit di admin). */
export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const post = await Post.findByPk(Number(req.params.id), {
    include: [authorInclude, categoryInclude],
  });
  if (!post) throw ApiError.notFound("Post tidak ditemukan");

  const isOwner = post.authorId === req.user!.sub;
  if (!isOwner && req.user!.role !== "admin") throw ApiError.forbidden();

  res.json({ success: true, data: post });
});

/** POST /posts — buat post (author/admin). */
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreatePostInput;
  const post = await Post.create({
    ...input,
    slug: uniqueSlug(input.title),
    authorId: req.user!.sub,
    publishedAt: input.status === "published" ? new Date() : null,
  });
  res.status(201).json({ success: true, data: post });
});

/** PATCH /posts/:id — ubah post. */
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await Post.findByPk(Number(req.params.id));
  if (!post) throw ApiError.notFound("Post tidak ditemukan");

  const isOwner = post.authorId === req.user!.sub;
  if (!isOwner && req.user!.role !== "admin") throw ApiError.forbidden();

  const input = req.body as UpdatePostInput;
  // Set publishedAt saat pertama kali dipublikasikan.
  if (input.status === "published" && post.status !== "published") {
    post.publishedAt = new Date();
  }
  await post.update(input);
  res.json({ success: true, data: post });
});

/** DELETE /posts/:id — hapus post. */
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await Post.findByPk(Number(req.params.id));
  if (!post) throw ApiError.notFound("Post tidak ditemukan");

  const isOwner = post.authorId === req.user!.sub;
  if (!isOwner && req.user!.role !== "admin") throw ApiError.forbidden();

  await post.destroy();
  res.json({ success: true, message: "Post dihapus" });
});
