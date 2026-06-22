import Link from "next/link";
import { AtSign, Coffee, MapPin } from "lucide-react";

export function StoreFooter() {
  return (
    <footer className="mt-20 border-t border-linea bg-pergamino">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-tueste-oscuro" />
            <span className="font-display text-base font-semibold">Coffee Vibes</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-espresso/60">
            Café de especialidad cultivado en las alturas de Chanchamayo. Tostamos
            en lotes pequeños y servimos cada taza con trazabilidad de origen.
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-espresso/45">
            Tienda
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-espresso/70">
            <li><Link href="/tienda" className="hover:text-tueste-oscuro">Catálogo completo</Link></li>
            <li><Link href="/pedidos" className="hover:text-tueste-oscuro">Seguimiento de pedidos</Link></li>
            <li><Link href="/perfil" className="hover:text-tueste-oscuro">Mis direcciones</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-espresso/45">
            Visítanos
          </p>
          <div className="mt-3 flex items-start gap-2 text-sm text-espresso/70">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-tueste" />
            <span>Jr. del Tueste 245, Chosica, Lima</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-espresso/70">
            <AtSign className="h-4 w-4 shrink-0 text-tueste" />
            <span>@coffeevibes.pe</span>
          </div>
        </div>
      </div>
      <div className="border-t border-linea px-4 py-4 sm:px-6">
        <p className="mx-auto max-w-6xl font-mono text-[11px] tracking-wide text-espresso/40">
          © {new Date().getFullYear()} Coffee Vibes — Lote local, tostado en casa.
        </p>
      </div>
    </footer>
  );
}
