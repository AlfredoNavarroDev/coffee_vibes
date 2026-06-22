import Link from "next/link";
import { Coffee } from "lucide-react";
import { OriginSeal } from "@/components/ui/origin-seal";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex flex-col px-6 py-10 sm:px-10 md:py-14">
        <Link href="/" className="flex items-center gap-2.5">
          <Coffee className="h-6 w-6 text-tueste-oscuro" />
          <span className="font-display text-lg font-semibold tracking-tight">
            Coffee Vibes
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <div className="relative hidden items-center justify-center overflow-hidden border-l border-linea bg-grain md:flex">
        <div className="absolute h-[70%] w-[70%] rounded-full bg-pergamino-2" />
        <OriginSeal size={280} className="relative" />
        <p className="absolute bottom-10 left-10 right-10 font-display text-xl italic text-tueste-oscuro/70">
          &ldquo;Cada lote, trazado desde la chacra hasta tu taza.&rdquo;
        </p>
      </div>
    </div>
  );
}
