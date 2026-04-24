import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, PawPrint } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CitaForm,
  type CaninoOption,
  type ServicioOption,
} from "@/components/forms/cita-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Next.js 16 — `searchParams` se consume SIEMPRE como Promise con `await`.
 * Regla obligatoria del plan: nunca leerlos síncronamente.
 */
export default async function NuevaCitaPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string | string[] }>;
}) {
  const { servicio } = await searchParams;
  const servicioIdInicial =
    typeof servicio === "string" && UUID_REGEX.test(servicio)
      ? servicio
      : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [caninosRes, serviciosRes] = await Promise.all([
    supabase
      .from("caninos")
      .select("id, nombre, raza")
      .eq("propietario_id", user.id)
      .order("nombre", { ascending: true })
      .returns<CaninoOption[]>(),
    supabase
      .from("servicios")
      .select("id, nombre, categoria, precio, duracion_minutos")
      .eq("activo", true)
      .order("categoria", { ascending: true })
      .order("nombre", { ascending: true })
      .returns<ServicioOption[]>(),
  ]);

  const caninos = caninosRes.data ?? [];
  const servicios = serviciosRes.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-fit -ml-3 text-muted-foreground"
        >
          <Link href="/dashboard/citas">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver a mis citas
          </Link>
        </Button>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Agendar nueva cita
        </h1>
        <p className="max-w-lg text-base text-muted-foreground">
          Un flujo de dos pasos: elige los detalles y revisa antes de confirmar.
        </p>
      </header>

      {caninos.length === 0 ? (
        <EmptyCaninos />
      ) : (
        <CitaForm
          userId={user.id}
          caninos={caninos}
          servicios={servicios}
          servicioIdInicial={servicioIdInicial}
        />
      )}
    </div>
  );
}

function EmptyCaninos() {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div
          className="mb-2 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <PawPrint className="size-6" strokeWidth={1.75} />
        </div>
        <CardTitle className="font-display text-xl font-semibold">
          Primero registra un canino
        </CardTitle>
        <CardDescription className="max-w-sm">
          Para agendar una cita necesitas tener al menos un peludo registrado en
          tu perfil.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild size="lg" className="press-feedback">
          <Link href="/dashboard/caninos/nuevo">
            <PawPrint className="size-4" aria-hidden="true" />
            Registrar canino
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
