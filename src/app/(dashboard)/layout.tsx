import Link from "next/link";
import { redirect } from "next/navigation";
import { PawPrint } from "lucide-react";
import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("usuarios")
    .select("nombre_completo, rol")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-dvh bg-background">
      <a
        href="#contenido"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-3 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground"
      >
        Saltar al contenido
      </a>

      <DashboardSidebar
        profile={profile}
        email={user.email ?? ""}
        className="hidden lg:flex"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/85 px-4 py-3 backdrop-blur-sm supports-backdrop-filter:bg-card/70 lg:hidden">
          <MobileNav profile={profile} email={user.email ?? ""} />
          <Link
            href="/dashboard"
            className="press-feedback flex items-center gap-2"
            aria-label="Inicio VETPAL"
          >
            <span
              className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground shadow-sm"
              aria-hidden="true"
            >
              <PawPrint className="size-4" strokeWidth={2.5} />
            </span>
            <span
              className="font-display text-lg font-extrabold tracking-tight"
              style={{ letterSpacing: "-0.03em" }}
            >
              VETPAL
            </span>
          </Link>
        </header>

        <main
          id="contenido"
          className="flex-1 px-5 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
