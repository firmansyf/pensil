import type { Request, Response } from "express";
import { Category } from "../models/category.model";
import { Post } from "../models/post.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slugify";

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  res.json({ success: true, data: categories });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body as { name: string; description?: string | null };
  const category = await Category.create({ name, slug: slugify(name), description });
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByPk(Number(req.params.id));
  if (!category) throw ApiError.notFound("Kategori tidak ditemukan");

  const { name, description } = req.body as { name?: string; description?: string | null };
  await category.update({
    ...(name ? { name, slug: slugify(name) } : {}),
    ...(description !== undefined ? { description } : {}),
  });
  res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByPk(Number(req.params.id));
  if (!category) throw ApiError.notFound("Kategori tidak ditemukan");

  // Lepas relasi post agar tidak melanggar FK (set null).
  await Post.update({ categoryId: null }, { where: { categoryId: category.id } });
  await category.destroy();
  res.json({ success: true, message: "Kategori dihapus" });
});
