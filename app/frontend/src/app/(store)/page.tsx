import Link from "next/link";
import { ArrowRight, Leaf, MapPin, Truck } from "lucide-react";
import { OriginSeal } from "@/components/ui/origin-seal";
import { ButtonLink } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/store/featured-products";
import { CategoryStrip } from "@/components/store/category-strip";

export default function HomePage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-linea bg-grain">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-linea-fuerte bg-pergamino px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-oliva" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-espresso/60">
                Lote actual · Chanchamayo, Junín
              </span>
            </div>

            <h1 className="font-display text-balance text-[2.6rem] font-medium leading-[1.05] tracking-tight text-espresso sm:text-6xl">
              Café que se sirve con{" "}
              <span className="italic text-tueste-oscuro">su origen</span>
            </h1>

            <p className="mt-5 max-w-md text-balance text-base leading-relaxed text-espresso/65 sm:text-lg">
              Tostamos en lotes pequeños y trazamos cada saco hasta la chacra.
              Pide en línea, elige delivery o recojo en tienda, y recibe tu
              taza tal como la catamos.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/tienda" size="lg">
                Ver catálogo
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/tienda?productType=bebida" variant="outline" size="lg">
                Pedir una bebida
              </ButtonLink>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-linea pt-6">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-espresso/45">
                  Altura
                </dt>
                <dd className="font-display text-2xl font-medium text-tueste-oscuro">1,800m</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-espresso/45">
                  Variedad
                </dt>
                <dd className="font-display text-2xl font-medium text-tueste-oscuro">Típica</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-espresso/45">
                  Tueste
                </dt>
                <dd className="font-display text-2xl font-medium text-tueste-oscuro">Medio</dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
            <div className="absolute h-[78%] w-[78%] rounded-full bg-pergamino-2" />
            <OriginSeal size={300} className="relative" />
          </div>
        </div>
      </section>

      {/* ─── Promesas / ficha ─── */}
      <section className="border-b border-linea bg-pergamino">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-sm border border-linea bg-linea sm:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Recojo en tienda",
              desc: "Listo en minutos, sin costo de envío.",
            },
            {
              icon: Truck,
              title: "Delivery a domicilio",
              desc: "Entrega con tarifa fija a tu dirección guardada.",
            },
            {
              icon: Leaf,
              title: "Trazabilidad real",
              desc: "Cada lote indica origen, altura y perfil de tueste.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-pergamino px-6 py-8">
              <item.icon className="h-5 w-5 text-tueste" strokeWidth={1.75} />
              <h3 className="mt-3 font-display text-base font-medium text-espresso">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-espresso/60">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Categorías ─── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading
          eyebrow="Explora"
          title="Encuentra tu categoría"
        />
        <CategoryStrip />
      </section>

      {/* ─── Destacados ─── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading
          eyebrow="Recién tostado"
          title="Lo más pedido esta semana"
          action={
            <Link
              href="/tienda"
              className="hidden font-mono text-[12px] uppercase tracking-wider text-tueste-oscuro hover:underline sm:flex items-center gap-1"
            >
              Ver todo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <FeaturedProducts />
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-display text-2xl font-medium tracking-tight text-espresso sm:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
