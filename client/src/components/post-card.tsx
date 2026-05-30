import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, stripHtml } from "@/lib/utils";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <Link
        href={`/blog/${post.slug}`}
        className="bg-muted relative block aspect-video w-full overflow-hidden"
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground/40 flex h-full items-center justify-center">
            <ImageIcon className="size-10" />
          </div>
        )}
      </Link>
      <CardHeader>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          {post.category && <Badge variant="secondary">{post.category.name}</Badge>}
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
        </div>
        <CardTitle className="text-xl">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {post.excerpt ?? stripHtml(post.content).slice(0, 160)}
        </p>
        <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
          <span>oleh {post.author?.name ?? "Anonim"}</span>
          <span>·</span>
          <span>{post.viewCount} kali dibaca</span>
        </div>
      </CardContent>
    </Card>
  );
}
