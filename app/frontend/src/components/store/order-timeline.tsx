import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/lib/order-status";
import type { OrderStatus } from "@/types";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <ol className="flex items-start">
      {ORDER_STATUS_FLOW.map((step, idx) => {
        const done = idx <= currentIndex;
        const isLast = idx === ORDER_STATUS_FLOW.length - 1;
        return (
          <li key={step} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]",
                  done
                    ? "border-tueste-oscuro bg-tueste-oscuro text-pergamino"
                    : "border-linea-fuerte bg-pergamino text-espresso/40"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </span>
              {!isLast && (
                <span
                  className={cn(
                    "h-[2px] flex-1",
                    idx < currentIndex ? "bg-tueste-oscuro" : "bg-linea-fuerte"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "mt-2 px-1 font-mono text-[9px] uppercase tracking-wide",
                done ? "text-espresso/75" : "text-espresso/35"
              )}
            >
              {ORDER_STATUS_LABEL[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
