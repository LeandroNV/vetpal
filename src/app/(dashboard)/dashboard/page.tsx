import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCheck,
  Clock,
  ClipboardPlus,
  PawPrint,
  Plus,
  Stethoscope,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccionesVeterinario } from "@/components/citas/acciones-veterinario";
import { ESTADO_BADGE, esEstadoCita } from "@/lib/domain/citas";
import {
  CATEGORIA_LABEL,
  esCategoriaServicio,
} from "@/lib/domain/servicios";
import { cn, formatearFecha } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getAuthProfile } from "@/lib/supabase/get-profile";
import type { Database } from "@/lib/supabase/database.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — VETPAL",
  description: "Panel principal con resumen de caninos, citas próximas y acceso rápido a todas las funcionalidades.",
};

export const dynamic = "force-dynamic";

type Rol = Database["public"]["Enums"]["rol_usuario"];

/* ========================================================================== */
/* Helpers compartidos                                                        */
/* ========================================================================== */

function saludoPorHora(date: Date): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "Buenos días";
  if (h >= 12 && h < 20) return "Buenas tardes";
  return "Buenas noches";
}

function formatearHoraCorta(fecha: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(fecha));
}

function formatearFechaCorta(fecha: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(new Date(fecha));
}

/* ========================================================================== */
/* Página principal — dispatch por rol                                        */
/* ========================================================================== */

export default async function DashboardHomePage() {
  const auth = await getAuthProfile();
  if (!auth) return null;

  const { user, profile } = auth;

  if (profile.rol === "veterinario" || profile.rol === "administrador") {
    return (
      <VeterinarioDashboard
        nombre={profile.nombre_completo}
        userId={user.id}
      />
    );
  }

  return <PropietarioDashboard userId={user.id} nombre={profile.nombre_completo} />;
}

/* ========================================================================== */
/* Vista PROPIETARIO — exactamente como estaba                                */
/* ========================================================================== */

const PROPIETARIO_ESTADO_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  pendiente: {
    label: "Pendiente",
    className: "bg-secondary/70 text-secondary-foreground",
  },
  confirmada: {
    label: "Confirmada",
    className: "bg-primary/10 text-primary",
  },
};

async function PropietarioDashboard({
  userId,
  nombre,
}: {
  userId: string;
  nombre: string;
}) {
  const supabase = await createClient();
  const ahora = new Date();

  const [countRes, citasRes] = await Promise.all([
    supabase
      .from("caninos")
      .select("*", { count: "exact", head: true })
      .eq("propietario_id", userId),
    supabase
      .from("citas")
      .select(
        "id, fecha_hora, estado, canino:caninos(id, nombre), servicio:servicios(nombre)"
      )
      .eq("usuario_id", userId)
      .in("estado", ["pendiente", "confirmada"])
      .gt("fecha_hora", ahora.toISOString())
      .order("fecha_hora", { ascending: true })
      .limit(3),
  ]);

  const displayName = nombre?.split(" ")[0] ?? "amig@";
  const caninosCount = countRes.count ?? 0;
  const citas = citasRes.data ?? [];
  const proxima = citas[0];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <header className="flex flex-col gap-2 auth-enter auth-enter-1">
        <p className="text-sm font-medium text-muted-foreground">
          {saludoPorHora(ahora)},
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {displayName}
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Este es el resumen del cuidado de tus peludos. Agenda citas, revisa
          su historial clínico y mantenlos sanos.
        </p>
      </header>

      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auth-enter auth-enter-2"
        aria-label="Resumen general"
      >
        <StatCard
          icon={PawPrint}
          label="Caninos registrados"
          value={caninosCount.toString()}
          hint={
            caninosCount === 0
              ? "Aún no has añadido ningún canino"
              : caninosCount === 1
                ? "Tu peludo está en buenas manos"
                : `Tus ${caninosCount} peludos están en buenas manos`
          }
          tone="primary"
        />
        <StatCard
          icon={CalendarClock}
          label="Citas próximas"
          value={citas.length.toString()}
          hint={
            citas.length === 0
              ? "Sin citas agendadas"
              : citas.length === 1
                ? "1 cita por atender"
                : `${citas.length} citas por atender`
          }
          tone="accent"
        />
        <StatCard
          icon={Clock}
          label="Próxima cita"
          value={proxima ? formatearFechaCorta(proxima.fecha_hora) : "—"}
          hint={
            proxima
              ? `${formatearHoraCorta(proxima.fecha_hora)} h`
              : "Agenda una cuando quieras"
          }
          tone="secondary"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-5 auth-enter auth-enter-3">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="font-display text-xl font-semibold">
                Próximas citas
              </CardTitle>
              <CardDescription>
                Las 3 más cercanas en tu agenda.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/citas">
                Ver todas
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {citas.length === 0 ? (
              <EmptyCitas />
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {citas.map((cita) => {
                  const servicio =
                    (cita.servicio as { nombre?: string } | null)?.nombre ??
                    "Servicio";
                  const canino =
                    (cita.canino as { nombre?: string } | null)?.nombre ??
                    "";
                  const badge = PROPIETARIO_ESTADO_BADGE[cita.estado] ?? {
                    label: cita.estado,
                    className: "bg-muted text-muted-foreground",
                  };
                  return (
                    <li key={cita.id} className="flex items-center gap-4 py-3">
                      <div
                        className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"
                        aria-hidden="true"
                      >
                        <CalendarDays className="size-5" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {servicio}
                          {canino ? (
                            <span className="text-muted-foreground">
                              {" · "}
                              {canino}
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatearFecha(cita.fecha_hora)}
                          {" · "}
                          {formatearHoraCorta(cita.fecha_hora)} h
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("border-transparent", badge.className)}
                      >
                        {badge.label}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <CtaRegistrarCanino className="lg:col-span-2" />
      </section>
    </div>
  );
}

/* ========================================================================== */
/* Vista VETERINARIO — panel de trabajo                                       */
/* ========================================================================== */

interface VetCitaItem {
  id: string;
  fecha_hora: string;
  estado: string;
  canino_id: string;
  canino_nombre: string;
  canino_raza: string | null;
  servicio_nombre: string;
  servicio_categoria: string;
  propietario_nombre: string;
}

async function VeterinarioDashboard({
  nombre,
  userId,
}: {
  nombre: string;
  userId: string;
}) {
  const supabase = await createClient();
  const ahora = new Date();
  const hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const hoyFin = new Date(hoyInicio.getTime() + 86_400_000);

  // Parallel fetches
  const [citasHoyRes, pendientesRes, completadasHoyRes, proximasRes] =
    await Promise.all([
      // Citas de hoy con identidad completa
      supabase
        .from("citas")
        .select(
          `id, fecha_hora, estado,
           servicio:servicios(nombre, categoria),
           canino:caninos(id, nombre, raza, propietario:usuarios!caninos_propietario_id_fkey(nombre_completo))`
        )
        .gte("fecha_hora", hoyInicio.toISOString())
        .lt("fecha_hora", hoyFin.toISOString())
        .order("fecha_hora", { ascending: true }),

      // Count pendientes globales
      supabase
        .from("citas")
        .select("*", { count: "exact", head: true })
        .eq("estado", "pendiente"),

      // Count completadas hoy
      supabase
        .from("citas")
        .select("*", { count: "exact", head: true })
        .eq("estado", "completada")
        .gte("fecha_hora", hoyInicio.toISOString())
        .lt("fecha_hora", hoyFin.toISOString()),

      // Próximas citas (futuras)
      supabase
        .from("citas")
        .select(
          `id, fecha_hora, estado,
           servicio:servicios(nombre, categoria),
           canino:caninos(id, nombre, raza, propietario:usuarios!caninos_propietario_id_fkey(nombre_completo))`
        )
        .gt("fecha_hora", ahora.toISOString())
        .in("estado", ["pendiente", "confirmada"])
        .order("fecha_hora", { ascending: true })
        .limit(5),
    ]);

  // Map raw data to VetCitaItem
  function mapCita(raw: Record<string, unknown>): VetCitaItem {
    const servicio = raw.servicio as { nombre?: string; categoria?: string } | null;
    const canino = raw.canino as {
      id?: string;
      nombre?: string;
      raza?: string | null;
      propietario?: { nombre_completo?: string } | null;
    } | null;

    return {
      id: raw.id as string,
      fecha_hora: raw.fecha_hora as string,
      estado: raw.estado as string,
      canino_id: canino?.id ?? "",
      canino_nombre: canino?.nombre ?? "—",
      canino_raza: canino?.raza ?? null,
      servicio_nombre: servicio?.nombre ?? "Servicio",
      servicio_categoria: servicio?.categoria ?? "",
      propietario_nombre: canino?.propietario?.nombre_completo ?? "—",
    };
  }

  const citasHoy = (citasHoyRes.data ?? []).map((c) => mapCita(c as Record<string, unknown>));
  const citasHoyActivas = citasHoy.filter(
    (c) => c.estado === "pendiente" || c.estado === "confirmada"
  ).length;
  const pendientesCount = pendientesRes.count ?? 0;
  const completadasHoyCount = completadasHoyRes.count ?? 0;
  const proximasCitas = (proximasRes.data ?? []).map((c) => mapCita(c as Record<string, unknown>));

  const displayName = nombre.split(" ")[0];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <header className="flex flex-col gap-2 auth-enter auth-enter-1">
        <p className="text-sm font-medium text-muted-foreground">
          {saludoPorHora(ahora)},
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Dr. {displayName}
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Panel de atención veterinaria
        </p>
      </header>

      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auth-enter auth-enter-2"
        aria-label="Estadísticas del día"
      >
        <StatCard
          icon={CalendarDays}
          label="Citas hoy"
          value={citasHoyActivas.toString()}
          hint={
            citasHoyActivas === 0
              ? "Sin citas activas hoy"
              : citasHoyActivas === 1
                ? "1 cita activa para hoy"
                : `${citasHoyActivas} citas activas hoy`
          }
          tone="primary"
        />
        <StatCard
          icon={Clock}
          label="Pendientes de confirmar"
          value={pendientesCount.toString()}
          hint={
            pendientesCount === 0
              ? "Todas confirmadas"
              : `${pendientesCount} esperando confirmación`
          }
          tone="accent"
        />
        <StatCard
          icon={CheckCheck}
          label="Completadas hoy"
          value={completadasHoyCount.toString()}
          hint={
            completadasHoyCount === 0
              ? "Aún no hay consultas completadas"
              : `${completadasHoyCount} consultas atendidas`
          }
          tone="secondary"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-5 auth-enter auth-enter-3">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="font-display text-xl font-semibold">
                Citas de hoy
              </CardTitle>
              <CardDescription>
                Agenda del día ordenada por hora.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/citas">
                Ver todas
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {citasHoy.length === 0 ? (
              <EmptyVetHoy />
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {citasHoy.map((cita) => {
                  const estadoCfg = esEstadoCita(cita.estado)
                    ? ESTADO_BADGE[cita.estado]
                    : null;
                  const catLabel = esCategoriaServicio(cita.servicio_categoria)
                    ? CATEGORIA_LABEL[cita.servicio_categoria]
                    : null;
                  const diffMinutos =
                    (new Date(cita.fecha_hora).getTime() - Date.now()) / 60000;
                  const esUrgente =
                    cita.estado === "confirmada" &&
                    diffMinutos > 0 &&
                    diffMinutos <= 30;

                  return (
                    <li
                      key={cita.id}
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-center gap-3 py-4 sm:py-3 transition-colors",
                        esUrgente && "bg-destructive/5 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-lg"
                      )}
                    >
                      <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                        <div className="flex shrink-0 flex-col items-center mt-0.5 sm:mt-0">
                          <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
                            {formatearHoraCorta(cita.fecha_hora)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">
                              <Link
                                href={`/dashboard/historial?canino=${cita.canino_id}`}
                                className="hover:text-primary hover:underline underline-offset-2 transition-colors"
                              >
                                {cita.canino_nombre}
                              </Link>{" "}
                              <span className="font-normal text-muted-foreground">
                                ({cita.canino_raza?.trim() || "Mestizo"})
                              </span>
                            </p>
                            {catLabel ? (
                              <Badge
                                variant="secondary"
                                className="shrink-0 text-[10px]"
                              >
                                {catLabel}
                              </Badge>
                            ) : null}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {cita.servicio_nombre} · Prop: {cita.propietario_nombre}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex shrink-0 items-center gap-2 pl-[3.25rem] sm:pl-0">
                        {estadoCfg ? (
                          <>
                            {cita.estado === "confirmada" &&
                            (() => {
                              const diffMinutos =
                                (new Date(cita.fecha_hora).getTime() - Date.now()) / 60000;
                              return diffMinutos > 0 && diffMinutos <= 30;
                            })() ? (
                              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                                <span className="relative flex size-1.5">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                                  <span className="relative inline-flex size-1.5 rounded-full bg-destructive"></span>
                                </span>
                                En breve
                              </span>
                            ) : null}
                            <span
                              className={cn(
                                "inline-flex shrink-0 h-6 items-center rounded-full px-2 text-[11px] font-medium",
                                estadoCfg.className
                              )}
                            >
                              {estadoCfg.label}
                            </span>
                          </>
                        ) : null}
                        <AccionesVeterinario
                          citaId={cita.id}
                          caninoId={cita.canino_id}
                          estado={cita.estado}
                          servicioNombre={cita.servicio_nombre}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="font-display text-xl font-semibold">
                Próximas citas
              </CardTitle>
              <CardDescription>Las 5 más cercanas.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/citas">
                Ver todas
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {proximasCitas.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Sin citas próximas
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {proximasCitas.map((cita) => {
                  const estadoCfg = esEstadoCita(cita.estado)
                    ? ESTADO_BADGE[cita.estado]
                    : null;
                  return (
                    <li
                      key={cita.id}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <div
                        className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
                        aria-hidden="true"
                      >
                        <CalendarDays className="size-4" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {cita.canino_nombre}{" "}
                          <span className="font-normal text-muted-foreground">
                            ({cita.canino_raza?.trim() || "Mestizo"})
                          </span>
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {formatearFechaCorta(cita.fecha_hora)}
                          {" · "}
                          {formatearHoraCorta(cita.fecha_hora)} h · {cita.propietario_nombre}
                        </p>
                      </div>
                      {estadoCfg ? (
                        <span
                          className={cn(
                            "inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium",
                            estadoCfg.className
                          )}
                        >
                          {estadoCfg.label}
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

/* ========================================================================== */
/* Componentes compartidos                                                    */
/* ========================================================================== */

type StatTone = "primary" | "accent" | "secondary";

const TONE_STYLES: Record<StatTone, { chip: string; ring: string }> = {
  primary: {
    chip: "bg-primary/10 text-primary",
    ring: "ring-primary/10",
  },
  accent: {
    chip: "bg-accent/15 text-accent",
    ring: "ring-accent/10",
  },
  secondary: {
    chip: "bg-secondary/20 text-secondary-foreground",
    ring: "ring-secondary/15",
  },
};

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  hint: string;
  tone: StatTone;
}) {
  const styles = TONE_STYLES[tone];
  return (
    <Card
      size="sm"
      className={cn("justify-between gap-3", styles.ring)}
    >
      <CardHeader className="flex-row items-center justify-between gap-3 px-6 pb-0">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "grid size-9 place-items-center rounded-xl",
            styles.chip
          )}
          aria-hidden="true"
        >
          <Icon className="size-4" strokeWidth={2} />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 pb-1">
        <p className="font-display text-3xl font-bold tracking-tight text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function EmptyCitas() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/40 px-6 py-10 text-center">
      <div
        className="grid size-12 place-items-center rounded-2xl bg-card text-muted-foreground shadow-sm"
        aria-hidden="true"
      >
        <CalendarDays className="size-5" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">
          No tienes citas agendadas
        </p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Reserva tu primera consulta en pocos pasos y lleva el control del
          cuidado de tu peludo.
        </p>
      </div>
      <Button asChild size="sm">
        <Link href="/dashboard/citas">
          Agendar primera cita
          <ArrowRight className="size-4" strokeWidth={2} />
        </Link>
      </Button>
    </div>
  );
}

function EmptyVetHoy() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/40 px-6 py-10 text-center">
      <div
        className="grid size-12 place-items-center rounded-2xl bg-card text-muted-foreground shadow-sm"
        aria-hidden="true"
      >
        <Stethoscope className="size-5" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">
          No hay citas programadas para hoy
        </p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Las citas agendadas por los propietarios aparecerán aquí.
        </p>
      </div>
    </div>
  );
}

function CtaRegistrarCanino({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border border-dashed border-border bg-card shadow-none",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-accent/10 blur-2xl"
      />
      <CardHeader className="gap-3 px-6">
        <span
          className="grid size-11 place-items-center rounded-2xl bg-accent/15 text-accent"
          aria-hidden="true"
        >
          <PawPrint className="size-5" strokeWidth={2} />
        </span>
        <div className="flex flex-col gap-1">
          <CardTitle className="font-display text-lg font-semibold">
            Registrar nuevo canino
          </CardTitle>
          <CardDescription>
            Añade la información básica de tu peludo para empezar a llevar su
            historial clínico.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/caninos/nuevo">
            <Plus className="size-4" strokeWidth={2} />
            Agregar canino
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
