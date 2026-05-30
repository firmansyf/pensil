import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Eye } from "lucide-react";
import { getPost } from "@/lib/api";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, readingTime, stripHtml } from "@/lib/utils";
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
    description: post.excerpt ?? stripHtml(post.content).slice(0, 150),
  };
}

export default async function BlogDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Kembali ke beranda
      </Link>

      <header className="mx-auto mt-8 max-w-2xl text-center">
        <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
          {post.category && <Badge variant="secondary">{post.category.name}</Badge>}
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
          <span className="bg-muted-foreground/40 size-1 rounded-full" />
          <span>{readingTime(post.content)}</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg text-pretty">
            {post.excerpt}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Avatar name={post.author?.name} src={post.author?.avatarUrl} className="size-9" />
          <div className="text-left text-sm">
            <p className="font-medium">{post.author?.name ?? "Anonim"}</p>
            <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <Eye className="size-3" />
              {post.viewCount} kali dibaca
            </p>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        </div>
      )}

      <div
        className="post-content mx-auto mt-10 max-w-2xl text-lg leading-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="border-border/60 mx-auto mt-12 max-w-2xl border-t pt-8 text-center">
        <p className="text-muted-foreground text-sm">Terima kasih sudah membaca ✦</p>
        <Link
          href="/"
          className="text-foreground mt-2 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        >
          <ArrowLeft className="size-4" />
          Baca tulisan lainnya
        </Link>
      </footer>
    </article>
  );
}
