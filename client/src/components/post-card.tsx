import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, readingTime, stripHtml } from "@/lib/utils";
import type { Post } from "@/lib/types";

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const href = `/blog/${post.slug}`;
  const excerpt = post.excerpt ?? stripHtml(post.content).slice(0, featured ? 220 : 140);

  return (
    <article
      className={cn(
        "group bg-card relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        featured && "sm:grid sm:grid-cols-2 sm:items-stretch",
      )}
    >
      <Link
        href={href}
        className={cn(
          "bg-muted relative block overflow-hidden",
          featured ? "aspect-[16/10] sm:aspect-auto sm:h-full" : "aspect-[16/10]",
        )}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes={featured ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 50vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground/30 flex h-full items-center justify-center">
            <ImageIcon className="size-12" />
          </div>
        )}
        {post.category && (
          <span className="absolute left-3 top-3">
            <Badge className="bg-background/80 text-foreground border-transparent shadow-sm backdrop-blur">
              {post.category.name}
            </Badge>
          </span>
        )}
      </Link>

      <div className={cn("flex flex-1 flex-col p-5", featured && "sm:justify-center sm:p-8")}>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
          <span className="bg-muted-foreground/40 size-1 rounded-full" />
          <span>{readingTime(post.content)}</span>
        </div>

        <h3
          className={cn(
            "mt-2 font-bold tracking-tight",
            featured ? "text-2xl sm:text-3xl" : "text-xl",
          )}
        >
          <Link href={href} className="decoration-foreground/30 underline-offset-4 hover:underline">
            {post.title}
          </Link>
        </h3>

        <p
          className={cn(
            "text-muted-foreground mt-3 text-sm",
            featured ? "line-clamp-4" : "line-clamp-3",
          )}
        >
          {excerpt}
        </p>

        <div className="text-muted-foreground mt-auto flex items-center gap-2 pt-5 text-xs">
          <Avatar name={post.author?.name} src={post.author?.avatarUrl} className="size-6" />
          <span className="text-foreground font-medium">{post.author?.name ?? "Anonim"}</span>
          <span className="bg-muted-foreground/40 size-1 rounded-full" />
          <span>{post.viewCount} kali dibaca</span>
        </div>
      </div>
    </article>
  );
}
