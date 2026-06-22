"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, LogOut, Menu, ShoppingBag, User2, X, LayoutDashboard } from "lucide-react";
import { useAuthStore, isStaff } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/pedidos", label: "Mis pedidos" },
];

export function StoreHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const totalItems = useCartStore((s) => s.totalItems());
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-crudo/95 backdrop-blur-sm">
      <div className="dash-line absolute bottom-0 left-0 right-0" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Coffee className="h-6 w-6 text-tueste-oscuro" strokeWidth={2} />
          <span className="font-display text-lg font-semibold tracking-tight text-espresso">
            Coffee Vibes
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-[12px] uppercase tracking-wider text-espresso/60 transition-colors hover:text-tueste-oscuro",
                pathname === link.href && "text-tueste-oscuro"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user && isStaff(user.role) && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-oliva-oscuro transition-colors hover:text-oliva",
                pathname.startsWith("/admin") && "text-oliva"
              )}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Panel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-sm border border-linea-fuerte text-espresso transition-colors hover:border-tueste hover:text-tueste-oscuro"
            aria-label="Ver carrito"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-tueste-oscuro px-1 font-mono text-[10px] font-semibold text-pergamino">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/perfil"
                className="flex h-10 items-center gap-2 rounded-sm border border-linea-fuerte px-3 text-sm text-espresso transition-colors hover:border-tueste"
              >
                <User2 className="h-4 w-4" />
                <span className="max-w-[110px] truncate">{user.name || user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-linea-fuerte text-espresso/70 transition-colors hover:border-rojo-error hover:text-rojo-error"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-sm border border-tueste-oscuro bg-tueste-oscuro px-4 text-sm font-medium text-pergamino transition-colors hover:bg-tueste sm:flex"
            >
              Ingresar
            </Link>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-linea-fuerte md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-linea bg-pergamino px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-sm px-3 py-2.5 font-mono text-sm uppercase tracking-wide text-espresso/70 hover:bg-pergamino-2"
              >
                {link.label}
              </Link>
            ))}
            {user && isStaff(user.role) && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="rounded-sm px-3 py-2.5 font-mono text-sm uppercase tracking-wide text-oliva-oscuro hover:bg-pergamino-2"
              >
                Panel de administración
              </Link>
            )}
            <div className="my-2 h-px bg-linea" />
            {user ? (
              <>
                <Link
                  href="/perfil"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-sm px-3 py-2.5 text-sm text-espresso/70 hover:bg-pergamino-2"
                >
                  Mi perfil ({user.name || user.email})
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-sm px-3 py-2.5 text-left text-sm text-rojo-error hover:bg-pergamino-2"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-sm bg-tueste-oscuro px-3 py-2.5 text-center text-sm font-medium text-pergamino"
              >
                Ingresar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
