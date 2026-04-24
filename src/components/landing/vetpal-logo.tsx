import { PawPrint } from "lucide-react";

import { cn } from "@/lib/utils";

export function VetpalLogo({
  className,
  textClassName,
  iconSize = "md",
  compact = false,
}: {
  className?: string;
  textClassName?: string;
  iconSize?: "md" | "sm";
  compact?: boolean;
}) {
  const iconBox = iconSize === "sm" ? "size-8 rounded-lg" : "size-10 rounded-xl";
  const iconGlyph = iconSize === "sm" ? "size-4" : "size-5";
  const textSize = compact
    ? "text-lg font-extrabold"
    : "text-2xl font-extrabold";

  return (
    <span
      className={cn("inline-flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "grid place-items-center bg-accent text-accent-foreground shadow-sm",
          iconBox
        )}
        aria-hidden="true"
      >
        <PawPrint className={cn(iconGlyph)} strokeWidth={2.5} />
      </span>
      <span
        className={cn(
          "font-display tracking-tight",
          textSize,
          textClassName
        )}
        style={{ letterSpacing: "-0.03em" }}
      >
        VETPAL
      </span>
    </span>
  );
}
