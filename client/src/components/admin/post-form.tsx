"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { createPost, updatePost, listCategories } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { uploadConfigured, uploadImage } from "@/lib/upload";
import { stripHtml } from "@/lib/utils";
import type { Category, Post } from "@/lib/types";

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      update("coverImage", url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      router.push("/login?redirect=/admin/posts");
      return;
    }
    if (!stripHtml(form.content)) {
      setError("Konten tidak boleh kosong.");
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
        <Label>Konten</Label>
        <RichTextEditor value={form.content} onChange={(html) => update("content", html)} />
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
        <Label>Gambar Sampul</Label>

        {form.coverImage ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={form.coverImage}
              alt="Pratinjau gambar sampul"
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => update("coverImage", "")}
              className="bg-background/80 absolute right-2 top-2 rounded-md border p-1 backdrop-blur transition-colors hover:bg-background"
              aria-label="Hapus gambar"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !uploadConfigured}
            className="border-input text-muted-foreground hover:bg-muted/40 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Mengunggah…
              </>
            ) : (
              <>
                <ImagePlus className="size-5" />
                {uploadConfigured ? "Klik untuk unggah gambar" : "Upload belum dikonfigurasi"}
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="space-y-1">
          <Label htmlFor="coverImage" className="text-muted-foreground text-xs font-normal">
            atau tempel URL gambar
          </Label>
          <Input
            id="coverImage"
            value={form.coverImage ?? ""}
            onChange={(e) => update("coverImage", e.target.value)}
            placeholder="https://…"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting || uploading}>
          {submitting ? "Menyimpan…" : post ? "Simpan Perubahan" : "Buat Tulisan"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
