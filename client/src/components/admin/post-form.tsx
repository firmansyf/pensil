"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPost, updatePost, listCategories } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Category, Post } from "@/lib/types";

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverImage: post?.coverImage ?? "",
    status: post?.status ?? "draft",
    categoryId: post?.categoryId ? String(post.categoryId) : "",
  });

  useEffect(() => {
    listCategories()
      .then((res) => setCategories(res.data))
      .catch(() => undefined);
  }, []);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      router.push("/login?redirect=/admin/posts");
      return;
    }
    setSubmitting(true);
    setError(null);

    const payload = {
      title: form.title,
      excerpt: form.excerpt || null,
      content: form.content,
      coverImage: form.coverImage || null,
      status: form.status,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    };

    try {
      if (post) {
        await updatePost(post.id, payload, token);
      } else {
        await createPost(payload, token);
      }
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Judul</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Judul tulisan"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Ringkasan</Label>
        <Textarea
          id="excerpt"
          value={form.excerpt ?? ""}
          onChange={(e) => update("excerpt", e.target.value)}
          placeholder="Ringkasan singkat (opsional)"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Konten</Label>
        <Textarea
          id="content"
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          placeholder="Tulis isi blog di sini…"
          rows={12}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <select
            id="category"
            value={form.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
          >
            <option value="">Tanpa kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => update("status", e.target.value as Post["status"])}
            className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Publikasikan</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">URL Gambar Sampul</Label>
        <Input
          id="coverImage"
          value={form.coverImage ?? ""}
          onChange={(e) => update("coverImage", e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan…" : post ? "Simpan Perubahan" : "Buat Tulisan"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
