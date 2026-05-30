"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAuth, getStoredUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import type { User } from "@/lib/types";

export function AdminHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <header className="bg-background/80 flex h-14 items-center justify-between border-b px-6 backdrop-blur">
      <h1 className="text-sm font-medium">Panel Admin</h1>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-sm">{user?.name ?? "Tamu"}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="size-4" />
          Keluar
        </Button>
      </div>
    </header>
  );
}
