import Link from "next/link";
import Image from "next/image";
import { LogOut, PawPrint } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/database.types";

import { LogoutButton } from "./logout-button";
import { NavList } from "./nav-list";
import { ThemeToggle } from "./theme-toggle";
import { VetCommandMenu } from "./vet-command-menu";

type Rol = Database["public"]["Enums"]["rol_usuario"];

type Profile = {
  id: string;
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
        className="press-feedback flex items-center px-6 pt-7 pb-6"
        aria-label="Inicio VETPAL"
      >
        <Image src="/images/landing/logo.svg" alt="VETPAL Logo" width={140} height={32} className="h-8 w-auto dark:brightness-0 dark:invert" />
      </Link>

      {(profile?.rol === "veterinario" || profile?.rol === "administrador") && (
        <div className="px-6 pb-6">
          <VetCommandMenu />
        </div>
      )}

      <div className="flex-1 px-4">
        <NavList rol={profile?.rol ?? "propietario"} />
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
        <ThemeToggle />
        <LogoutButton />
      </div>
    </aside>
  );
}

