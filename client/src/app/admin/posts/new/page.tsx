import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tulisan Baru</h2>
        <p className="text-muted-foreground text-sm">Buat tulisan blog baru.</p>
      </div>
      <PostForm />
    </div>
  );
}
