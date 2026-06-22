import { cn } from "@/lib/utils";

/**
 * Sello de origen — elemento gráfico distintivo de Coffee Vibes.
 * Evoca el sello que se estampa en los sacos de café de exportación,
 * con el texto recorriendo el círculo. Se usa con moderación: hero,
 * estados vacíos y loading.
 */
export function OriginSeal({
  size = 160,
  spinning = true,
  className,
  label = "COFFEE VIBES",
  sublabel = "CHANCHAMAYO · PERÚ",
}: {
  size?: number;
  spinning?: boolean;
  className?: string;
  label?: string;
  sublabel?: string;
}) {
  const id = `seal-path-${label.replace(/\s/g, "")}`;
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn(spinning && "seal-spin", className)}
      aria-hidden="true"
    >
      <defs>
        <path id={id} d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
        <path
          id={`${id}-in`}
          d="M 100,100 m -58,0 a 58,58 0 1,0 116,0 a 58,58 0 1,0 -116,0"
        />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="var(--tueste)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="var(--tueste)" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="44" fill="none" stroke="var(--tueste)" strokeWidth="1" opacity="0.6" />
      <text fill="var(--tueste-oscuro)" fontSize="13" letterSpacing="3" fontFamily="var(--font-mono), monospace">
        <textPath href={`#${id}`} startOffset="0%">
          {label} · {label} ·
        </textPath>
      </text>
      <text fill="var(--oliva-oscuro)" fontSize="9" letterSpacing="2" fontFamily="var(--font-mono), monospace">
        <textPath href={`#${id}-in`} startOffset="50%">
          {sublabel} · {sublabel} ·
        </textPath>
      </text>
      <path
        d="M100 88c-8 0-14 7-14 15 0 7 5 13 11 14.5-1 3-3 5-6 6.5a1 1 0 00.5 1.9c6-.3 10.4-3 13-6.3 7.8-1 13.5-7.4 13.5-16.1 0-8-6-15-17-15.5z"
        fill="var(--tueste)"
        opacity="0.85"
        transform="translate(0,-4) scale(0.9) translate(11,8)"
      />
    </svg>
  );
}
