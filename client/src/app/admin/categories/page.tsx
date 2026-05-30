"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listCategories, createCategory, deleteCategory } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await listCategories();
      setCategories(res.data);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      await createCategory({ name, description: description || null }, token);
      setName("");
      setDescription("");
      void load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus kategori ini?")) return;
    const token = getToken();
    if (!token) return;
    await deleteCategory(id, token);
    void load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Kategori</h2>
        <p className="text-muted-foreground text-sm">Kelola kategori tulisan.</p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tambah Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Deskripsi</Label>
                <Input
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Menyimpan…" : "Tambah"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground py-8 text-center">
                      Belum ada kategori.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
