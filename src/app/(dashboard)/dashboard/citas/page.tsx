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
import { cn } from "@/lib/utils";
import { CitaCard, type CitaCardData } from "@/components/citas/cita-card";
import { createClient } from "@/lib/supabase/server";
import { getAuthProfile } from "@/lib/supabase/get-profile";
import type { Database } from "@/lib/supabase/database.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Citas — VETPAL",
  description: "Gestiona tus citas veterinarias: agenda, confirma y revisa el historial de visitas.",
};

export const dynamic = "force-dynamic";

type Rol = Database["public"]["Enums"]["rol_usuario"];

/* ========================================================================== */
/* Página principal                                                           */
/* ========================================================================== */

export default async function CitasPage() {
  const auth = await getAuthProfile();
  if (!auth) redirect("/login");

  const { user, profile } = auth;
  const esVet = profile.rol === "veterinario" || profile.rol === "administrador";

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
      <header className="flex flex-wrap items-end justify-between gap-4 auth-enter auth-enter-1">
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

      <Tabs defaultValue="proximas" className="gap-6 auth-enter auth-enter-2">
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

  const vetSelect = `id, fecha_hora, estado, observaciones,
     servicio:servicios(id, nombre, categoria, precio, duracion_minutos),
     canino:caninos(id, nombre, raza, propietario:usuarios!caninos_propietario_id_fkey(nombre_completo))`;

  type VetCitaRaw = {
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
  };

  const ahora = new Date();
  const hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const hoyFin = new Date(hoyInicio.getTime() + 86_400_000);

  // 3 queries paralelas con filtros en servidor — no carga todo
  const [hoyRes, proximasRes, historialRes] = await Promise.all([
    // Hoy: todas las citas del día
    supabase
      .from("citas")
      .select(vetSelect)
      .gte("fecha_hora", hoyInicio.toISOString())
      .lt("fecha_hora", hoyFin.toISOString())
      .order("fecha_hora", { ascending: true })
      .returns<VetCitaRaw[]>(),

    // Próximas: futuras activas (máx 50)
    supabase
      .from("citas")
      .select(vetSelect)
      .gte("fecha_hora", hoyFin.toISOString())
      .in("estado", ["pendiente", "confirmada"])
      .order("fecha_hora", { ascending: true })
      .limit(50)
      .returns<VetCitaRaw[]>(),

    // Historial: completadas/canceladas (máx 50, más recientes primero)
    supabase
      .from("citas")
      .select(vetSelect)
      .in("estado", ["completada", "cancelada"])
      .order("fecha_hora", { ascending: false })
      .limit(50)
      .returns<VetCitaRaw[]>(),
  ]);

  function mapVetCita(c: VetCitaRaw): VetCita {
    return {
      ...c,
      propietario_nombre: c.canino?.propietario?.nombre_completo ?? null,
      canino: c.canino
        ? { id: c.canino.id, nombre: c.canino.nombre, raza: c.canino.raza }
        : null,
    };
  }

  const hoy = (hoyRes.data ?? []).map(mapVetCita);
  const proximas = (proximasRes.data ?? []).map(mapVetCita);
  const historialVet = (historialRes.data ?? []).map(mapVetCita);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="flex flex-wrap items-end justify-between gap-4 auth-enter auth-enter-1">
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

      <Tabs defaultValue="hoy" className="gap-6 auth-enter auth-enter-2">
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

function EmptyCitasIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("text-primary", className)}
      fill="none"
    >
      <circle cx="64" cy="64" r="60" className="fill-current opacity-10" />
      <path
        d="M44 48H84C88.4183 48 92 51.5817 92 56V84C92 88.4183 88.4183 92 84 92H44C39.5817 92 36 88.4183 36 84V56C36 51.5817 39.5817 48 44 48Z"
        className="stroke-current opacity-30"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 56H92M80 40V56M48 40V56"
        className="stroke-current opacity-50"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="54" cy="72" r="4" className="fill-current opacity-70" />
      <circle cx="74" cy="72" r="4" className="fill-current opacity-40" />
      <circle cx="54" cy="82" r="4" className="fill-current opacity-40" />
    </svg>
  );
}

function EmptyProximas() {
  return (
    <Card className="items-center gap-6 px-6 py-16 text-center">
      <EmptyCitasIllustration className="size-32 text-primary/40" />
      <div className="flex max-w-sm flex-col gap-2">
        <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
          No tienes citas próximas
        </h3>
        <p className="text-sm text-muted-foreground">
          Cuando agendes tu siguiente visita, aparecerá aquí con todos los
          detalles.
        </p>
      </div>
      <Button asChild size="lg" className="press-feedback mt-2">
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
    <Card className="items-center gap-6 px-6 py-16 text-center">
      <EmptyCitasIllustration className="size-32 text-primary/40" />
      <div className="flex max-w-sm flex-col gap-2">
        <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
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
