import Link from "next/link";
import { Sparkles } from "lucide-react";
import { listPosts, listCategories } from "@/lib/api";
import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

  const [featured, ...rest] = posts;
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <section className="mb-12">
        <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm font-medium">
          <Sparkles className="size-4" />
          Kumpulan tulisan
        </span>
        <h1 className="from-foreground to-foreground/55 mt-3 bg-gradient-to-br bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
          Pensil
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">
          Tempat semua tulisan random — dari catatan teknis sampai curhat tengah malam. Pilih satu,
          tarik napas, dan baca pelan-pelan.
        </p>
      </section>

      {categories.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <CategoryPill href="/" active={!category}>
            Semua
          </CategoryPill>
          {categories.map((c) => (
            <CategoryPill key={c.id} href={`/?category=${c.slug}`} active={category === c.slug}>
              {c.name}
            </CategoryPill>
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
          desc={
            q || activeCategory
              ? "Tidak ada tulisan yang cocok. Coba kategori atau kata kunci lain."
              : "Tulisan yang dipublikasikan akan muncul di sini."
          }
        />
      ) : (
        <div className="space-y-12">
          <PostCard post={featured} featured />

          {rest.length > 0 && (
            <section>
              <h2 className="mb-6 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Tulisan lainnya
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Badge
        variant={active ? "default" : "outline"}
        className={cn("px-3 py-1 text-sm transition-colors", !active && "hover:bg-muted")}
      >
        {children}
      </Badge>
    </Link>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border-border/60 rounded-2xl border border-dashed p-16 text-center">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-muted-foreground mx-auto mt-1 max-w-md text-sm">{desc}</p>
    </div>
  );
}
