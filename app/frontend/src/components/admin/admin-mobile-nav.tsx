"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, ShoppingCart, Tags } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Resumen", icon: LayoutGrid },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-30 flex gap-1 overflow-x-auto border-b border-linea bg-pergamino px-3 py-2.5 md:hidden">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide",
              active ? "bg-tueste-oscuro text-pergamino" : "text-espresso/60"
            )}
          >
            <link.icon className="h-3.5 w-3.5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
