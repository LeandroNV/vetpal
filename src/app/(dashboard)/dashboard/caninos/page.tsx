import Link from "next/link";
import {
  ClipboardList,
  Pencil,
  Plus,
  Scale,
  CakeSlice,
  Mars,
  Venus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { HoverCardWrapper } from "@/components/ui/hover-card-wrapper";
import { Separator } from "@/components/ui/separator";
import { EliminarCaninoButton } from "@/components/caninos/eliminar-canino-button";
import { calcularEdad, cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type Canino = Tables<"caninos">;

export default async function CaninosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: caninos } = await supabase
    .from("caninos")
    .select("*")
    .eq("propietario_id", user.id)
    .order("created_at", { ascending: false });

  const list = caninos ?? [];
  const hasCaninos = list.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Tus peludos
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Mis Caninos
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Gestiona la información de tus mascotas, revisa su historial y
            registra nuevas incorporaciones a la familia.
          </p>
        </div>
        {hasCaninos ? (
          <Button asChild size="lg" className="sm:self-end">
            <Link href="/dashboard/caninos/nuevo">
              <Plus className="size-4" strokeWidth={2} />
              Agregar canino
            </Link>
          </Button>
        ) : null}
      </header>

      {hasCaninos ? (
        <section
          aria-label="Listado de caninos"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((canino) => (
            <CaninoCard key={canino.id} canino={canino} ultimaVisita={null} />
          ))}
        </section>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function CaninoCard({
  canino,
  ultimaVisita,
}: {
  canino: Canino;
  ultimaVisita: string | null;
}) {
  const initial = canino.nombre.charAt(0).toUpperCase();
  const esMacho = canino.sexo === "M";
  const SexoIcon = esMacho ? Mars : Venus;

  const ultimaVisitaTexto = ultimaVisita
    ? new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(ultimaVisita))
    : null;

  return (
    <HoverCardWrapper>
      <Card className="group/canino flex h-full flex-col gap-4 transition-shadow duration-200 hover:shadow-lg">
        <CardHeader className="flex-row items-center gap-4 px-6 pb-0">
          <div
            className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 font-display text-xl font-bold text-primary"
            aria-hidden="true"
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-semibold text-foreground">
              {canino.nombre}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {canino.raza?.trim() || "Mestizo"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-2 px-6 flex-1">
          <MetaCell
            icon={SexoIcon}
            label="Sexo"
            value={esMacho ? "Macho" : "Hembra"}
          />
          <MetaCell
            icon={CakeSlice}
            label="Edad"
            value={calcularEdad(canino.fecha_nacimiento)}
          />
          <MetaCell
            icon={Scale}
            label="Peso"
            value={canino.peso_kg != null ? `${canino.peso_kg} kg` : "—"}
          />
        </CardContent>

        <CardFooter className="flex-col gap-2 pt-0 px-6">
          <Button asChild className="w-full justify-start" size="sm">
            <Link href={`/dashboard/citas/nueva?canino=${canino.id}`}>
              <Plus className="mr-2 size-4" strokeWidth={2} />
              Agendar cita
            </Link>
          </Button>
          <div className="flex w-full gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex-1 justify-start text-muted-foreground"
            >
              <Link href={`/dashboard/historial?canino=${canino.id}`}>
                <ClipboardList className="mr-2 size-4" strokeWidth={1.75} />
                Historial
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex-1 justify-start text-muted-foreground"
            >
              <Link href={`/dashboard/caninos/${canino.id}/editar`}>
                <Pencil className="mr-2 size-4" strokeWidth={1.75} />
                Editar
              </Link>
            </Button>
            <EliminarCaninoButton caninoId={canino.id} nombre={canino.nombre} />
          </div>
        </CardFooter>
      </Card>
    </HoverCardWrapper>
  );
}

function MetaCell({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3" strokeWidth={2} aria-hidden="true" />
        {label}
      </dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="items-center gap-6 px-6 py-16 text-center">
      <EmptyIllustration className="size-32 text-primary/40" />
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Aún no tienes caninos registrados
        </h2>
        <p className="text-sm text-muted-foreground">
          Comienza registrando a tu peludo. Así podrás agendar citas, llevar
          su historial clínico y recibir recordatorios de vacunas.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/dashboard/caninos/nuevo">
          <Plus className="size-4" strokeWidth={2} />
          Registrar mi primer canino
        </Link>
      </Button>
    </Card>
  );
}

function EmptyIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("text-primary", className)}
      fill="none"
    >
      <circle
        cx="64"
        cy="64"
        r="60"
        className="fill-current opacity-10"
      />
      <circle
        cx="64"
        cy="64"
        r="44"
        className="stroke-current opacity-20"
        strokeWidth="1.25"
        strokeDasharray="4 6"
      />
      {/* Huella estilizada al estilo PawPrint */}
      <g
        className="fill-current opacity-70"
        transform="translate(64 70)"
      >
        <ellipse cx="0" cy="8" rx="16" ry="13" />
        <ellipse cx="-18" cy="-8" rx="6" ry="8" />
        <ellipse cx="-8" cy="-20" rx="5" ry="7" />
        <ellipse cx="8" cy="-20" rx="5" ry="7" />
        <ellipse cx="18" cy="-8" rx="6" ry="8" />
      </g>
    </svg>
  );
}
