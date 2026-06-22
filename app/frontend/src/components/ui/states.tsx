import { AlertTriangle, Coffee } from "lucide-react";
import { OriginSeal } from "@/components/ui/origin-seal";
import { Button } from "@/components/ui/button";

export function LoadingState({ label = "Moliendo el pedido..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <OriginSeal size={88} />
      <p className="font-mono text-xs uppercase tracking-widest text-espresso/45">
        {label}
      </p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-rojo-error/30 bg-rojo-error/5 px-6 py-16 text-center">
      <AlertTriangle className="h-8 w-8 text-rojo-error" />
      <p className="max-w-sm text-sm text-espresso/70">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-linea-fuerte bg-pergamino">
        <Coffee className="h-7 w-7 text-tueste/60" />
      </div>
      <div>
        <h3 className="font-display text-lg font-medium text-espresso">{title}</h3>
        {description && (
          <p className="mt-1.5 max-w-sm text-sm text-espresso/55">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
