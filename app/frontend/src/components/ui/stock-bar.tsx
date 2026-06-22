import { cn } from "@/lib/utils";

/**
 * Barra de disponibilidad, inspirada en las barras de intensidad/cuerpo
 * que aparecen en las fichas de catación de café. Dobla como indicador
 * de stock sin ser un literal "X de 100 unidades".
 */
export function StockBar({ stock }: { stock: number }) {
  const level = stock <= 0 ? 0 : stock < 10 ? 1 : stock < 30 ? 2 : stock < 60 ? 3 : 4;
  const labels = ["Agotado", "Últimas unidades", "Disponible", "Buen stock", "Stock alto"];
  const colors = [
    "bg-rojo-error",
    "bg-miel",
    "bg-oliva",
    "bg-oliva",
    "bg-oliva-oscuro",
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-3.5 rounded-[1px]",
              i < level ? colors[level] : "bg-linea"
            )}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-wide text-espresso/50">
        {labels[level]}
      </span>
    </div>
  );
}
