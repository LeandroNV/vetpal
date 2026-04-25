import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CalendarX2,
  ClipboardList,
  Plus,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CitaCard, type CitaCardData } from "@/components/citas/cita-card";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type Rol = Database["public"]["Enums"]["rol_usuario"];

/* ========================================================================== */
/* Página principal                                                           */
/* ========================================================================== */

export default async function CitasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();

  const rol: Rol = profile?.rol ?? "propietario";
  const esVet = rol === "veterinario" || rol === "administrador";

  if (esVet) {
    return <VeterinarioCitasView />;
  }

  return <PropietarioCitasView userId={user.id} />;
}

/* ========================================================================== */
/* Vista PROPIETARIO — exactamente como estaba                                */
/* ========================================================================== */

async function PropietarioCitasView({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: citas } = await supabase
    .from("citas")
    .select(
      "id, fecha_hora, estado, observaciones, servicio:servicios(id, nombre, categoria, precio, duracion_minutos), canino:caninos(id, nombre, raza)"
    )
    .eq("usuario_id", userId)
    .order("fecha_hora", { ascending: false })
    .returns<CitaCardData[]>();

  const ahora = Date.now();
  const todas = citas ?? [];

  const proximas = todas
    .filter(
      (c) =>
        (c.estado === "pendiente" || c.estado === "confirmada") &&
        new Date(c.fecha_hora).getTime() > ahora
    )
    .sort(
      (a, b) =>
        new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime()
    );

  const historial = todas.filter(
    (c) =>
      c.estado === "completada" ||
      c.estado === "cancelada" ||
      new Date(c.fecha_hora).getTime() <= ahora
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Agenda
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Mis Citas
          </h1>
          <p className="max-w-lg text-base text-muted-foreground">
            Revisa tus próximas visitas y el historial completo del cuidado de
            tu peludo.
          </p>
        </div>
        <Button asChild size="lg" className="press-feedback">
          <Link href="/dashboard/citas/nueva">
            <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
            Nueva cita
          </Link>
        </Button>
      </header>

      <Tabs defaultValue="proximas" className="gap-6">
        <TabsList>
          <TabsTrigger value="proximas">
            Próximas
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background/80 px-1.5 text-xs font-semibold text-foreground tabular-nums">
              {proximas.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="historial">
            Historial
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background/80 px-1.5 text-xs font-semibold text-foreground tabular-nums">
              {historial.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proximas" className="focus-visible:outline-none">
          {proximas.length > 0 ? (
            <div className="flex flex-col gap-4">
              {proximas.map((c) => (
                <CitaCard key={c.id} cita={c} rol="propietario" />
              ))}
            </div>
          ) : (
            <EmptyProximas />
          )}
        </TabsContent>

        <TabsContent value="historial" className="focus-visible:outline-none">
          {historial.length > 0 ? (
            <div className="flex flex-col gap-4">
              {historial.map((c) => (
                <CitaCard key={c.id} cita={c} rol="propietario" />
              ))}
            </div>
          ) : (
            <EmptyHistorial />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ========================================================================== */
/* Vista VETERINARIO — gestión de citas con tabs Hoy/Próximas/Historial       */
/* ========================================================================== */

interface VetCita extends CitaCardData {
  propietario_nombre: string | null;
}

async function VeterinarioCitasView() {
  const supabase = await createClient();

  const { data: citas } = await supabase
    .from("citas")
    .select(
      `id, fecha_hora, estado, observaciones,
       servicio:servicios(id, nombre, categoria, precio, duracion_minutos),
       canino:caninos(id, nombre, raza, propietario:usuarios!caninos_propietario_id_fkey(nombre_completo))`
    )
    .order("fecha_hora", { ascending: true })
    .returns<
      Array<{
        id: string;
        fecha_hora: string;
        estado: string;
        observaciones: string | null;
        servicio: {
          id: string;
          nombre: string;
          categoria: string;
          precio: number;
          duracion_minutos: number;
        } | null;
        canino: {
          id: string;
          nombre: string;
          raza: string | null;
          propietario: { nombre_completo: string } | null;
        } | null;
      }>
    >();

  const ahora = new Date();
  const hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const hoyFin = new Date(hoyInicio.getTime() + 86_400_000);

  const todas = (citas ?? []).map((c) => ({
    ...c,
    propietario_nombre: c.canino?.propietario?.nombre_completo ?? null,
    canino: c.canino
      ? { id: c.canino.id, nombre: c.canino.nombre, raza: c.canino.raza }
      : null,
  })) satisfies VetCita[];

  const hoy = todas.filter((c) => {
    const d = new Date(c.fecha_hora);
    return d >= hoyInicio && d < hoyFin;
  });

  const proximas = todas.filter((c) => {
    const d = new Date(c.fecha_hora);
    return (
      d >= hoyFin &&
      (c.estado === "pendiente" || c.estado === "confirmada")
    );
  });

  const historialVet = todas.filter(
    (c) => c.estado === "completada" || c.estado === "cancelada"
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Gestión
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Gestión de Citas
          </h1>
          <p className="max-w-lg text-base text-muted-foreground">
            Confirma, atiende y gestiona las citas de todos los pacientes.
          </p>
        </div>
      </header>

      <Tabs defaultValue="hoy" className="gap-6">
        <TabsList>
          <TabsTrigger value="hoy">
            Hoy
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background/80 px-1.5 text-xs font-semibold text-foreground tabular-nums">
              {hoy.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="proximas">
            Próximas
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background/80 px-1.5 text-xs font-semibold text-foreground tabular-nums">
              {proximas.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="historial">
            Historial
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background/80 px-1.5 text-xs font-semibold text-foreground tabular-nums">
              {historialVet.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hoy" className="focus-visible:outline-none">
          {hoy.length > 0 ? (
            <div className="flex flex-col gap-4">
              {hoy.map((c) => (
                <CitaCard key={c.id} cita={c} rol="veterinario" />
              ))}
            </div>
          ) : (
            <EmptyHoy />
          )}
        </TabsContent>

        <TabsContent value="proximas" className="focus-visible:outline-none">
          {proximas.length > 0 ? (
            <div className="flex flex-col gap-4">
              {proximas.map((c) => (
                <CitaCard key={c.id} cita={c} rol="veterinario" />
              ))}
            </div>
          ) : (
            <EmptyProximasVet />
          )}
        </TabsContent>

        <TabsContent value="historial" className="focus-visible:outline-none">
          {historialVet.length > 0 ? (
            <div className="flex flex-col gap-4">
              {historialVet.map((c) => (
                <CitaCard key={c.id} cita={c} rol="veterinario" />
              ))}
            </div>
          ) : (
            <EmptyHistorial />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ========================================================================== */
/* Empty states                                                               */
/* ========================================================================== */

function EmptyProximas() {
  return (
    <Card className="items-center gap-4 px-6 py-12 text-center">
      <div
        className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <CalendarDays className="size-6" strokeWidth={1.75} />
      </div>
      <div className="flex max-w-sm flex-col gap-2">
        <h3 className="font-display text-lg font-semibold text-foreground">
          No tienes citas próximas
        </h3>
        <p className="text-sm text-muted-foreground">
          Cuando agendes tu siguiente visita, aparecerá aquí con todos los
          detalles.
        </p>
      </div>
      <Button asChild className="press-feedback">
        <Link href="/dashboard/citas/nueva">
          <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
          Agendar ahora
        </Link>
      </Button>
    </Card>
  );
}

function EmptyHistorial() {
  return (
    <Card className="items-center gap-3 px-6 py-10 text-center">
      <div
        className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"
        aria-hidden="true"
      >
        <CalendarX2 className="size-5" strokeWidth={1.75} />
      </div>
      <p className="max-w-sm text-sm text-muted-foreground">
        Aún no hay historial de citas. Las citas completadas o canceladas se
        mostrarán aquí.
      </p>
    </Card>
  );
}

function EmptyHoy() {
  return (
    <Card className="items-center gap-4 px-6 py-12 text-center">
      <div
        className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <Stethoscope className="size-6" strokeWidth={1.75} />
      </div>
      <div className="flex max-w-sm flex-col gap-2">
        <h3 className="font-display text-lg font-semibold text-foreground">
          No hay citas programadas para hoy
        </h3>
        <p className="text-sm text-muted-foreground">
          Cuando los propietarios agenden citas para hoy, aparecerán aquí.
        </p>
      </div>
    </Card>
  );
}

function EmptyProximasVet() {
  return (
    <Card className="items-center gap-3 px-6 py-10 text-center">
      <div
        className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"
        aria-hidden="true"
      >
        <ClipboardList className="size-5" strokeWidth={1.75} />
      </div>
      <p className="max-w-sm text-sm text-muted-foreground">
        No hay citas próximas pendientes de confirmar o atender.
      </p>
    </Card>
  );
}
