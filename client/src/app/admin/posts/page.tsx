"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listPosts, deletePost } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listPosts({ limit: 50 }, getToken() ?? undefined);
      setPosts(res.data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: number) {
    if (!confirm("Hapus tulisan ini?")) return;
    const token = getToken();
    if (!token) return;
    await deletePost(id, token);
    void load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tulisan</h2>
          <p className="text-muted-foreground text-sm">Kelola semua tulisan.</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="size-4" /> Tulisan Baru
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                  Memuat…
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                  Belum ada tulisan.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === "published" ? "success" : "secondary"}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.category?.name ?? "—"}</TableCell>
                  <TableCell>{formatDate(post.publishedAt ?? post.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
