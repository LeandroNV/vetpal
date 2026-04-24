import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CaninoForm } from "@/components/forms/canino-form";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NuevoCaninoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" size="sm" className="self-start pl-2">
          <Link href="/dashboard/caninos">
            <ArrowLeft className="size-4" strokeWidth={2} />
            Volver a Mis Caninos
          </Link>
        </Button>
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Nuevo registro
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Registrar canino
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Añade la información básica de tu peludo. Podrás completar detalles
            clínicos más adelante.
          </p>
        </header>
      </div>

      <CaninoForm mode="create" userId={user.id} />
    </div>
  );
}
