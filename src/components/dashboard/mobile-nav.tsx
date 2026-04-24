"use client";

import Link from "next/link";
import { Menu, PawPrint } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
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

export function MobileNav({
  profile,
  email,
}: {
  profile: Profile;
  email: string;
}) {
  const [open, setOpen] = useState(false);

  const displayName = profile?.nombre_completo?.trim() || email || "Usuario";
  const initial = displayName.charAt(0).toUpperCase() || "?";
  const rolLabel = profile?.rol ? ROL_LABEL[profile.rol] : "";

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Abrir navegación"
          className="shrink-0 text-muted-foreground hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-72 flex-col gap-0 bg-card p-0 sm:max-w-xs"
        showCloseButton={false}
      >
        <SheetHeader className="gap-0 border-b border-border p-0">
          <SheetTitle className="sr-only">Navegación principal</SheetTitle>
          <Link
            href="/dashboard"
            onClick={close}
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
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-3">
          <NavList onNavigate={close} />
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
      </SheetContent>
    </Sheet>
  );
}
