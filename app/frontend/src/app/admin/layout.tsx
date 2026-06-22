import { RouteGuard } from "@/components/auth/route-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allow={["OWNER", "ADMIN"]}>
      <div className="flex min-h-screen bg-crudo">
        <AdminSidebar />
        <div className="flex-1">
          <AdminMobileNav />
          <main className="px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
