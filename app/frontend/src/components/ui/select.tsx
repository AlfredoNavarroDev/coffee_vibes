import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-[11px] uppercase tracking-wider text-espresso/60"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={inputId}
            ref={ref}
            className={cn(
              "h-11 w-full appearance-none rounded-sm border border-linea-fuerte bg-pergamino px-3.5 pr-9 text-sm text-espresso outline-none transition-colors focus:border-tueste",
              error && "border-rojo-error focus:border-rojo-error",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
        </div>
        {error && <p className="text-xs text-rojo-error">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
