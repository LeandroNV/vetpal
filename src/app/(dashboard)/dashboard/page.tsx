import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  Clock,
  PawPrint,
  Plus,
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
import { cn, formatearFecha } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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

const ESTADO_BADGE: Record<
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

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El layout ya redirige si no hay usuario, pero TS necesita el guard.
  if (!user) return null;

  const ahora = new Date();

  const [profileRes, countRes, citasRes] = await Promise.all([
    supabase
      .from("usuarios")
      .select("nombre_completo")
      .eq("id", user.id)
      .single(),
    supabase
      .from("caninos")
      .select("*", { count: "exact", head: true })
      .eq("propietario_id", user.id),
    supabase
      .from("citas")
      .select(
        "id, fecha_hora, estado, canino:caninos(id, nombre), servicio:servicios(nombre)"
      )
      .eq("usuario_id", user.id)
      .in("estado", ["pendiente", "confirmada"])
      .gt("fecha_hora", ahora.toISOString())
      .order("fecha_hora", { ascending: true })
      .limit(3),
  ]);

  const nombre =
    profileRes.data?.nombre_completo?.split(" ")[0] ?? "amig@";
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
          {nombre}
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
                  const badge = ESTADO_BADGE[cita.estado] ?? {
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
