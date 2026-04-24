import { cn } from "@/lib/utils";

type Strength = 0 | 1 | 2 | 3;

const LABELS = ["", "Débil", "Aceptable", "Fuerte"] as const;
const COLORS = [
  "bg-border",
  "bg-destructive",
  "bg-secondary",
  "bg-primary",
] as const;

/**
 * Visualizador de fuerza de contraseña: 3 barras que se llenan y colorean
 * según el score de `passwordStrength()` (0-3). Silencia el label cuando
 * no hay password para no robar foco visual al usuario.
 */
export function PasswordStrengthMeter({
  strength,
  hasPassword,
}: {
  strength: Strength;
  hasPassword: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1.5 pt-1"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-200",
              hasPassword && i <= strength ? COLORS[strength] : "bg-border"
            )}
          />
        ))}
      </div>
      {hasPassword && (
        <p className="text-xs text-muted-foreground">
          Seguridad:{" "}
          <span className="text-foreground">{LABELS[strength]}</span>
        </p>
      )}
    </div>
  );
}
