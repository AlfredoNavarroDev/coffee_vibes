import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-tueste-oscuro text-pergamino hover:bg-tueste border border-tueste-oscuro disabled:bg-linea-fuerte disabled:border-linea-fuerte disabled:text-espresso/40",
  secondary:
    "bg-oliva text-pergamino hover:bg-oliva-oscuro border border-oliva disabled:bg-linea-fuerte disabled:border-linea-fuerte disabled:text-espresso/40",
  outline:
    "bg-transparent text-espresso border border-espresso/30 hover:border-tueste hover:text-tueste-oscuro disabled:text-espresso/30 disabled:border-linea",
  ghost:
    "bg-transparent text-espresso hover:bg-pergamino-2 border border-transparent disabled:text-espresso/30",
  danger:
    "bg-rojo-error text-pergamino hover:bg-rojo-error/90 border border-rojo-error disabled:bg-linea-fuerte disabled:border-linea-fuerte disabled:text-espresso/40",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2",
};

const base =
  "inline-flex items-center justify-center font-medium rounded-sm transition-colors duration-150 disabled:cursor-not-allowed cursor-pointer select-none whitespace-nowrap";

interface ButtonProps
  extends BaseProps,
    ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        base,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends BaseProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        base,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </Link>
  );
}
