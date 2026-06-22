import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { OriginSeal } from "@/components/ui/origin-seal";

type Status = "success" | "failure" | "pending";

const CONFIG: Record<
  Status,
  { icon: React.ElementType; title: string; desc: string; color: string }
> = {
  success: {
    icon: CheckCircle2,
    title: "¡Pago aprobado!",
    desc: "Tu pedido fue confirmado y ya está en preparación. Te avisaremos cuando esté listo.",
    color: "text-verde-ok",
  },
  pending: {
    icon: Clock,
    title: "Pago en revisión",
    desc: "Estamos esperando la confirmación de Mercado Pago. Esto puede tardar unos minutos.",
    color: "text-miel",
  },
  failure: {
    icon: XCircle,
    title: "El pago no se completó",
    desc: "No pudimos procesar tu pago. Puedes intentarlo de nuevo desde tu pedido.",
    color: "text-rojo-error",
  },
};

export function PaymentResult({ status, orderId }: { status: Status; orderId: string }) {
  const { icon: Icon, title, desc, color } = CONFIG[status];

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <OriginSeal size={120} spinning={status === "pending"} />
      <Icon className={`mt-6 h-10 w-10 ${color}`} strokeWidth={1.75} />
      <h1 className="mt-4 font-display text-2xl font-medium text-espresso">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-espresso/60">{desc}</p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <ButtonLink href={`/pedidos/${orderId}`} fullWidth>
          Ver mi pedido
        </ButtonLink>
        <ButtonLink href="/tienda" variant="outline" fullWidth>
          Seguir comprando
        </ButtonLink>
      </div>

      <Link
        href="/"
        className="mt-6 font-mono text-[11px] uppercase tracking-wider text-espresso/40 hover:text-tueste-oscuro"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
