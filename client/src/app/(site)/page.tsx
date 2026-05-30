import Link from "next/link";
import { listPosts, listCategories } from "@/lib/api";
import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import type { Category, Post } from "@/lib/types";

export default async function HomePage(props: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await props.searchParams;

  let posts: Post[] = [];
  let categories: Category[] = [];
  let apiDown = false;

  try {
    const [postsRes, catsRes] = await Promise.all([
      listPosts({ category, search: q, limit: 12 }),
      listCategories(),
    ]);
    posts = postsRes.data;
    categories = catsRes.data;
  } catch {
    apiDown = true;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Pensil</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Kumpulan blog random — tempat semua tulisan, dari catatan teknis sampai curhat tengah
          malam.
        </p>
      </section>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/">
            <Badge variant={!category ? "default" : "outline"}>Semua</Badge>
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/?category=${c.slug}`}>
              <Badge variant={category === c.slug ? "default" : "outline"}>{c.name}</Badge>
            </Link>
          ))}
        </div>
      )}

      {apiDown ? (
        <EmptyState
          title="API belum aktif"
          desc="Jalankan server (pnpm dev:server) dan pastikan database sudah di-migrate & di-seed."
        />
      ) : posts.length === 0 ? (
        <EmptyState
          title="Belum ada tulisan"
          desc="Tulisan yang dipublikasikan akan muncul di sini."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border-border/60 rounded-xl border border-dashed p-12 text-center">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1 text-sm">{desc}</p>
    </div>
  );
}
