"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

/** Lindungi halaman admin: redirect ke /login bila belum ada token. */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login?redirect=/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center p-12 text-sm">
        Memeriksa sesi…
      </div>
    );
  }
  return <>{children}</>;
}
