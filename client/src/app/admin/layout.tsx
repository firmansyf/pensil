import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminGuard } from "@/components/admin/admin-guard";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <AdminGuard>{children}</AdminGuard>
        </main>
      </div>
    </div>
  );
}
