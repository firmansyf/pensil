import type { ApiResponse, Category, Paginated, Post, PostStatus, User } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    credentials: "include",
    // Selalu ambil data segar untuk konten yang sering berubah.
    cache: rest.cache ?? "no-store",
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, json?.message ?? "Request gagal", json?.details);
  }
  return json as T;
}

// ─── Posts ───────────────────────────────────────────────
export interface ListPostsParams {
  page?: number;
  limit?: number;
  status?: PostStatus;
  category?: string;
  search?: string;
}

export function listPosts(params: ListPostsParams = {}, token?: string) {
  const qs = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined && v !== null && v !== "") acc[k] = String(v);
      return acc;
    }, {}),
  );
  return request<Paginated<Post>>(`/posts?${qs.toString()}`, { token });
}

export function getPost(slug: string, token?: string) {
  return request<ApiResponse<Post>>(`/posts/${slug}`, { token });
}

export function getPostById(id: number, token: string) {
  return request<ApiResponse<Post>>(`/posts/id/${id}`, { token });
}

export function createPost(body: Record<string, unknown>, token: string) {
  return request<ApiResponse<Post>>(`/posts`, {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

export function updatePost(id: number, body: Record<string, unknown>, token: string) {
  return request<ApiResponse<Post>>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
}

export function deletePost(id: number, token: string) {
  return request<ApiResponse<null>>(`/posts/${id}`, { method: "DELETE", token });
}

// ─── Categories ──────────────────────────────────────────
export function listCategories() {
  return request<ApiResponse<Category[]>>(`/categories`);
}

export function createCategory(body: { name: string; description?: string | null }, token: string) {
  return request<ApiResponse<Category>>(`/categories`, {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

export function deleteCategory(id: number, token: string) {
  return request<ApiResponse<null>>(`/categories/${id}`, { method: "DELETE", token });
}

// ─── Auth ────────────────────────────────────────────────
export function login(body: { email: string; password: string }) {
  return request<ApiResponse<{ user: User; token: string }>>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function register(body: { name: string; email: string; password: string }) {
  return request<ApiResponse<{ user: User; token: string }>>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
