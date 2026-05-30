import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

async function fetchPost(slug: string): Promise<Post | null> {
  try {
    const res = await getPost(slug);
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await fetchPost(slug);
  if (!post) return { title: "Tulisan tidak ditemukan" };
  return {
    title: post.title,
    description: post.excerpt ?? post.content.slice(0, 150),
  };
}

export default async function BlogDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="text-muted-foreground text-sm hover:underline">
        ← Kembali
      </Link>

      <header className="mt-6">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          {post.category && <Badge variant="secondary">{post.category.name}</Badge>}
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          oleh {post.author?.name ?? "Anonim"} · {post.viewCount} kali dibaca
        </p>
      </header>

      <div className="mt-8 whitespace-pre-wrap leading-relaxed">{post.content}</div>
    </article>
  );
}
