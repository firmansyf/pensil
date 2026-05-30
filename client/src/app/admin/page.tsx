"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle2, FileEdit, FolderTree } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listPosts, listCategories } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Post } from "@/lib/types";

interface Stats {
  total: number;
  published: number;
  draft: number;
  categories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken() ?? undefined;
    Promise.all([
      listPosts({ limit: 50 }, token),
      listPosts({ status: "published", limit: 1 }, token),
      listPosts({ status: "draft", limit: 1 }, token),
      listCategories(),
    ])
      .then(([all, pub, draft, cats]) => {
        setStats({
          total: all.meta.total,
          published: pub.meta.total,
          draft: draft.meta.total,
          categories: cats.data.length,
        });
        setRecent(all.data.slice(0, 5));
      })
      .catch((e) => setError(e.message ?? "Gagal memuat data"));
  }, []);

  const cards = [
    { label: "Total Tulisan", value: stats?.total, icon: FileText },
    { label: "Dipublikasikan", value: stats?.published, icon: CheckCircle2 },
    { label: "Draft", value: stats?.draft, icon: FileEdit },
    { label: "Kategori", value: stats?.categories, icon: FolderTree },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Ringkasan konten Pensil.</p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}. Pastikan server berjalan & Anda sudah login sebagai admin.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {c.label}
                </CardTitle>
                <Icon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{c.value ?? "—"}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tulisan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm">Belum ada tulisan.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="truncate">{p.title}</span>
                  <span className="text-muted-foreground">{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
