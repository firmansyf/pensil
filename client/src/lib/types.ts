export type Role = "admin" | "author" | "reader";
export type PostStatus = "draft" | "published";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: PostStatus;
  publishedAt?: string | null;
  viewCount: number;
  authorId: number;
  categoryId?: number | null;
  author?: Pick<User, "id" | "name" | "avatarUrl">;
  category?: Pick<Category, "id" | "name" | "slug">;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  success: boolean;
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
