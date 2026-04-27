import Link from "next/link";
import { CalendarPlus, Clock, PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import { getAuthProfile } from "@/lib/supabase/get-profile";
import {
  CATEGORIAS,
  CATEGORIA_LABEL,
  esCategoriaServicio,
  type CategoriaServicio,
} from "@/lib/domain/servicios";
import type { Tables } from "@/lib/supabase/database.types";
import { formatearDuracion, formatearPrecioCOP } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Servicios — VETPAL",
  description: "Explora servicios veterinarios disponibles: consultas, vacunas, cirugías, estética y más.",
};

export const dynamic = "force-dynamic";

type Servicio = Tables<"servicios">;

export default async function ServiciosPage() {
  const supabase = await createClient();
  const auth = await getAuthProfile();
  const puedeAgendar = auth ? auth.profile.rol === "propietario" : true;

  const { data: servicios } = await supabase
    .from("servicios")
    .select("*")
    .eq("activo", true)
    .order("categoria", { ascending: true })
    .order("nombre", { ascending: true });

  const grupos = agruparPorCategoria(servicios ?? []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <header className="flex flex-col gap-2 auth-enter auth-enter-1">
        <p className="text-sm font-medium text-muted-foreground">
          Catálogo
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Catálogo de Servicios
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Explora todo lo que ofrecemos para tu peludo. Elige un servicio y
          agenda cuando te convenga.
        </p>
      </header>

      <Tabs defaultValue="salud_preventiva" className="gap-6 auth-enter auth-enter-2">
        <TabsList className="flex-wrap">
          {CATEGORIAS.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {CATEGORIA_LABEL[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIAS.map((cat) => {
          const lista = grupos[cat] ?? [];
          return (
            <TabsContent key={cat} value={cat} className="focus-visible:outline-none">
              {lista.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lista.map((s) => (
                    <ServicioCard key={s.id} servicio={s} mostrarAgendar={puedeAgendar} />
                  ))}
                </div>
              ) : (
                <EmptyCategoria nombre={CATEGORIA_LABEL[cat]} />
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function agruparPorCategoria(
  servicios: ReadonlyArray<Servicio>
): Partial<Record<CategoriaServicio, Servicio[]>> {
  const acc: Partial<Record<CategoriaServicio, Servicio[]>> = {};
  for (const s of servicios) {
    if (!esCategoriaServicio(s.categoria)) continue;
    (acc[s.categoria] ??= []).push(s);
  }
  return acc;
}

function ServicioCard({
  servicio,
  mostrarAgendar,
}: {
  servicio: Servicio;
  mostrarAgendar: boolean;
}) {
  return (
    <Card className="group/servicio gap-4 transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="gap-2">
        <CardTitle className="font-display text-lg font-semibold leading-snug">
          {servicio.nombre}
        </CardTitle>
        {servicio.descripcion ? (
          <CardDescription className="line-clamp-3">
            {servicio.descripcion}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="flex items-baseline gap-3">
        <span className="font-display text-2xl font-bold tracking-tight text-foreground tabular-nums">
          {formatearPrecioCOP(servicio.precio)}
        </span>
        <span
          aria-hidden="true"
          className="h-4 w-px bg-border"
        />
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          {formatearDuracion(servicio.duracion_minutos)}
        </span>
      </CardContent>

      {mostrarAgendar ? (
        <CardFooter className="pt-0">
          <Button asChild className="press-feedback w-full">
            <Link href={`/dashboard/citas/nueva?servicio=${servicio.id}`}>
              <CalendarPlus className="size-4" strokeWidth={2} aria-hidden="true" />
              Agendar
            </Link>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}

function EmptyCategoria({ nombre }: { nombre: string }) {
  return (
    <Card className="items-center gap-4 px-6 py-12 text-center">
      <div
        className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"
        aria-hidden="true"
      >
        <PackageSearch className="size-5" strokeWidth={1.75} />
      </div>
      <div className="flex max-w-xs flex-col gap-1">
        <h3 className="font-display text-base font-semibold text-foreground">
          Sin servicios en {nombre}
        </h3>
        <p className="text-sm text-muted-foreground">
          Por ahora no hay servicios disponibles en esta categoría. Vuelve
          pronto.
        </p>
      </div>
    </Card>
  );
}
