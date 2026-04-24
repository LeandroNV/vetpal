import Link from "next/link";
import { PawPrint } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/database.types";

import { LogoutButton } from "./logout-button";
import { NavList } from "./nav-list";

type Rol = Database["public"]["Enums"]["rol_usuario"];

type Profile = {
  nombre_completo: string;
  rol: Rol;
} | null;

const ROL_LABEL: Record<Rol, string> = {
  propietario: "Propietario",
  veterinario: "Veterinario",
  administrador: "Administrador",
};

export function DashboardSidebar({
  profile,
  email,
  className,
}: {
  profile: Profile;
  email: string;
  className?: string;
}) {
  const displayName = profile?.nombre_completo?.trim() || email || "Usuario";
  const initial = displayName.charAt(0).toUpperCase() || "?";
  const rolLabel = profile?.rol ? ROL_LABEL[profile.rol] : "";

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-dvh w-[260px] shrink-0 flex-col border-r border-border bg-card",
        className
      )}
    >
      <Link
        href="/dashboard"
        className="press-feedback flex items-center gap-2.5 px-6 pt-7 pb-6"
        aria-label="Inicio VETPAL"
      >
        <span
          className="grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground shadow-sm"
          aria-hidden="true"
        >
          <PawPrint className="size-4" strokeWidth={2.5} />
        </span>
        <span
          className="font-display text-xl font-extrabold tracking-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          VETPAL
        </span>
      </Link>

      <div className="flex-1 overflow-y-auto pb-4">
        <NavList />
      </div>

      <Separator />

      <div className="flex items-center gap-3 p-4">
        <div
          className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary"
          aria-hidden="true"
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {displayName}
          </p>
          {rolLabel ? (
            <p className="truncate text-xs text-muted-foreground">{rolLabel}</p>
          ) : null}
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
