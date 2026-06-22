import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
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
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-11 rounded-sm border border-linea-fuerte bg-pergamino px-3.5 text-sm text-espresso placeholder:text-espresso/35 outline-none transition-colors focus:border-tueste",
            error && "border-rojo-error focus:border-rojo-error",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rojo-error">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-espresso/45">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
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
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "min-h-24 rounded-sm border border-linea-fuerte bg-pergamino px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/35 outline-none transition-colors focus:border-tueste",
            error && "border-rojo-error focus:border-rojo-error",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rojo-error">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
