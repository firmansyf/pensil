import Link from "next/link";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-border/60 sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <PenLine className="size-5" />
          <span>Pensil</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Beranda</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/login">Masuk</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
