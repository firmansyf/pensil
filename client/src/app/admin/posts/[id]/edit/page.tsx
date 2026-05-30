"use client";

import { useEffect, useState, use } from "react";
import { PostForm } from "@/components/admin/post-form";
import { getPostById } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Post } from "@/lib/types";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    getPostById(Number(id), token)
      .then((res) => setPost(res.data))
      .catch((e) => setError((e as Error).message));
  }, [id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Tulisan</h2>
        <p className="text-muted-foreground text-sm">Ubah dan simpan perubahan.</p>
      </div>
      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : post ? (
        <PostForm post={post} />
      ) : (
        <p className="text-muted-foreground text-sm">Memuat…</p>
      )}
    </div>
  );
}
