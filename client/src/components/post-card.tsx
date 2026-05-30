import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
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
          {post.excerpt ?? post.content.slice(0, 160)}
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
