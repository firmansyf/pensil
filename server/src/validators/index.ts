import { z } from "zod";

// ─── Auth ────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ─── Post ────────────────────────────────────────────────
export const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
});

export const updatePostSchema = createPostSchema.partial();

export const listPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(["draft", "published"]).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

// ─── Category ────────────────────────────────────────────
export const createCategorySchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Comment ─────────────────────────────────────────────
export const createCommentSchema = z.object({
  body: z.string().min(1).max(2000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
