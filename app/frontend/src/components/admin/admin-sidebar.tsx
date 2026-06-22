"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, LayoutGrid, LogOut, Package, ShoppingCart, Tags, Store } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Resumen", icon: LayoutGrid },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-linea bg-pergamino px-5 py-7 md:flex">
      <Link href="/admin" className="flex items-center gap-2.5">
        <Coffee className="h-6 w-6 text-tueste-oscuro" />
        <div>
          <p className="font-display text-base font-semibold leading-tight">Coffee Vibes</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-espresso/45">
            Panel
          </p>
        </div>
      </Link>

      <nav className="mt-9 flex flex-col gap-1">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-tueste-oscuro text-pergamino"
                  : "text-espresso/65 hover:bg-pergamino-2"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-linea pt-4">
        <Link
          href="/tienda"
          className="flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm text-espresso/65 hover:bg-pergamino-2"
        >
          <Store className="h-4 w-4" />
          Ver tienda
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-left text-sm text-rojo-error hover:bg-pergamino-2"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
        {user && (
          <p className="mt-2 truncate px-3 font-mono text-[10px] text-espresso/40">
            {user.email}
          </p>
        )}
      </div>
    </aside>
  );
}
