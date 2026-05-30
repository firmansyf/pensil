"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, FolderTree, PenLine, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Tulisan", icon: FileText },
  // { href: "/admin/posts/new", label: "Tulisan Baru", icon: PlusCircle },
  { href: "/admin/categories", label: "Kategori", icon: FolderTree },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-card hidden w-60 shrink-0 border-r md:flex md:flex-col">
      <div className="flex h-14 items-center gap-2 border-b px-5 font-semibold">
        <PenLine className="size-5" />
        <span>Pensil Admin</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground block rounded-md px-3 py-2 text-sm"
        >
          ← Lihat situs
        </Link>
      </div>
    </aside>
  );
}
