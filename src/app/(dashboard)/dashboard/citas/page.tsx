import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, CalendarX2, Plus } from "lucide-react";

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

export const dynamic = "force-dynamic";

export default async function CitasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: citas } = await supabase
    .from("citas")
    .select(
      "id, fecha_hora, estado, observaciones, servicio:servicios(id, nombre, categoria, precio, duracion_minutos), canino:caninos(id, nombre)"
    )
    .eq("usuario_id", user.id)
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
                <CitaCard key={c.id} cita={c} />
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
                <CitaCard key={c.id} cita={c} />
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
        Aún no tienes historial de citas. Las citas completadas o canceladas se
        mostrarán aquí.
      </p>
    </Card>
  );
}
