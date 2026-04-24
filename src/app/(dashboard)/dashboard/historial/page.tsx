import Link from "next/link";
import { ClipboardList, Plus, Scale, CakeSlice } from "lucide-react";
import { redirect } from "next/navigation";

import {
  HistorialCaninoSelect,
  type CaninoSelectOption,
} from "@/components/historial/historial-canino-select";
import { HistorialCard } from "@/components/historial/historial-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import {
  calcularEdad,
  esAdministrador,
  esVeterinario,
  puedeEscribirHistorial,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function rolBadgeText(rol: string | null | undefined) {
  const m: Record<string, string> = {
    propietario: "Propietario",
    veterinario: "Veterinario",
    administrador: "Administrador",
  };
  if (!rol) return "—";
  return m[rol] ?? rol;
}

type HistorialRow = Tables<"historiales_clinicos">;

type ListEmbed = {
  cita: {
    servicio: { nombre: string } | null;
  } | null;
  canino: {
    id: string;
    nombre: string;
    raza: string | null;
    fecha_nacimiento: string | null;
    peso_kg: number | null;
    propietario: { nombre_completo: string } | null;
  } | null;
  veterinario: { nombre_completo: string } | null;
};

function mapListItem(
  row: HistorialRow & ListEmbed
): {
  id: string;
  created_at: string;
  motivo_consulta: string;
  diagnostico: string | null;
  tratamiento: string | null;
  medicamentos: string | null;
  proxima_cita: string | null;
  servicio_nombre: string | null;
  veterinario_nombre: string;
} {
  return {
    id: row.id,
    created_at: row.created_at,
    motivo_consulta: row.motivo_consulta,
    diagnostico: row.diagnostico,
    tratamiento: row.tratamiento,
    medicamentos: row.medicamentos,
    proxima_cita: row.proxima_cita,
    servicio_nombre: row.cita?.servicio?.nombre ?? null,
    veterinario_nombre: row.veterinario?.nombre_completo?.trim() || "—",
  };
}

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: Promise<{ canino?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = sp.canino;
  const caninoParam =
    typeof raw === "string" && UUID_REGEX.test(raw) ? raw : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: perfil, error: perfilErr } = await supabase
    .from("usuarios")
    .select("id, rol, nombre_completo")
    .eq("id", user.id)
    .single();

  if (perfilErr || !perfil) {
    redirect("/login");
  }

  const veHistorialGlobal =
    esVeterinario(perfil.rol) || esAdministrador(perfil.rol);
  const puedeNueva = puedeEscribirHistorial(perfil.rol);

  const listSelect = `
    id,
    created_at,
    motivo_consulta,
    diagnostico,
    tratamiento,
    medicamentos,
    proxima_cita,
    cita:citas!historiales_clinicos_cita_id_fkey (
      servicio:servicios!citas_servicio_id_fkey ( nombre )
    ),
    canino:caninos!historiales_clinicos_canino_id_fkey (
      id,
      nombre,
      raza,
      fecha_nacimiento,
      peso_kg,
      propietario:usuarios!caninos_propietario_id_fkey ( nombre_completo )
    ),
    veterinario:usuarios!historiales_clinicos_veterinario_id_fkey ( nombre_completo )
  `;

  if (veHistorialGlobal) {
    const { data: caninosVet } = await supabase
      .from("caninos")
      .select("id, nombre, raza")
      .order("nombre", { ascending: true });

    const caninosOptions: CaninoSelectOption[] = (caninosVet ?? []).map(
      (c) => ({
        id: c.id,
        nombre: c.nombre,
        raza: c.raza,
      })
    );

    let query = supabase
      .from("historiales_clinicos")
      .select(listSelect)
      .order("created_at", { ascending: false });

    if (caninoParam) {
      query = query.eq("canino_id", caninoParam);
    }

    const { data: filas, error: qerr } = await query;

    if (qerr) {
      console.error(qerr);
    }

    const rows = (filas ?? []) as unknown as (HistorialRow & ListEmbed)[];
    const items = rows.map(mapListItem);

    let caninoVista: Tables<"caninos"> | null = null;
    if (caninoParam) {
      const { data: c1 } = await supabase
        .from("caninos")
        .select("*")
        .eq("id", caninoParam)
        .maybeSingle();
      caninoVista = c1;
    }

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Clínica
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
                Historial clínico
              </h1>
              <Badge variant="secondary">{rolBadgeText(perfil.rol)}</Badge>
            </div>
            <p className="text-muted-foreground">
              Registros de consultas, diagnóstico y seguimiento por canino.
            </p>
          </div>
          {puedeNueva ? (
            <Button asChild size="lg" className="shrink-0">
              <Link href="/dashboard/historial/nueva">
                <Plus className="size-4" strokeWidth={2} />
                Nueva consulta
              </Link>
            </Button>
          ) : null}
        </header>

        <HistorialCaninoSelect
          caninos={caninosOptions}
          value={caninoParam}
          allowTodos
        />

        {caninoParam && caninoVista ? <ResumenCanino canino={caninoVista} /> : null}
        {caninoParam && !caninoVista ? (
          <p className="text-sm text-destructive" role="alert">
            No encontramos un canino con ese identificador.
          </p>
        ) : null}

        <section className="space-y-4" aria-label="Registros clínicos">
          {!caninoParam && items.length > 0 ? (
            <h2 className="font-display text-lg font-semibold text-foreground">
              Todos los registros
            </h2>
          ) : null}
          {items.length > 0 ? (
            <ul className="flex list-none flex-col gap-4 p-0">
              {items.map((item) => (
                <li key={item.id}>
                  <HistorialCard
                    item={item}
                    mostrarEditar={puedeNueva}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <Card className="bg-surface-muted/40">
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                <ClipboardList
                  className="size-10 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <p className="max-w-sm text-sm text-muted-foreground">
                  {caninoParam
                    ? "No hay registros clínicos para este canino todavía."
                    : "Aún no hay historial clínico registrado."}
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    );
  }

  // Propietario
  const { data: caninosProp } = await supabase
    .from("caninos")
    .select("id, nombre, raza, fecha_nacimiento, peso_kg, propietario_id")
    .eq("propietario_id", user.id)
    .order("nombre", { ascending: true });

  const misCaninos = caninosProp ?? [];
  const caninosOptions: CaninoSelectOption[] = misCaninos.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    raza: c.raza,
  }));

  const caninoIdValido =
    caninoParam && misCaninos.some((c) => c.id === caninoParam)
      ? caninoParam
      : null;
  const caninoActual = caninoIdValido
    ? misCaninos.find((c) => c.id === caninoIdValido)
    : null;

  const { data: filasProp, error: errProp } = caninoIdValido
    ? await supabase
        .from("historiales_clinicos")
        .select(listSelect)
        .eq("canino_id", caninoIdValido)
        .order("created_at", { ascending: false })
    : { data: null, error: null };

  if (errProp) {
    console.error(errProp);
  }

  const rowsP = (filasProp ?? []) as unknown as (HistorialRow & ListEmbed)[];
  const itemsP = rowsP.map(mapListItem);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Clínica</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
              Historial clínico
            </h1>
            <Badge variant="secondary">{rolBadgeText(perfil.rol)}</Badge>
          </div>
          <p className="text-muted-foreground">
            Consulta el historial de salud de tus caninos.
          </p>
        </div>
      </header>

      {misCaninos.length === 0 ? (
        <Card className="bg-surface-muted/40">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No tienes caninos registrados. Agrega un canino para ver su
              historial.
            </p>
            <Button asChild>
              <Link href="/dashboard/caninos/nuevo">Registrar canino</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <HistorialCaninoSelect
            caninos={caninosOptions}
            value={caninoIdValido}
            allowTodos={false}
            label="Elige un canino"
          />

          {!caninoIdValido ? (
            <Card className="border-dashed bg-surface-muted/50">
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Selecciona un canino
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Usa el selector para ver el historial clínico de una de tus
                mascotas. También puedes ir a{" "}
                <Link
                  className="font-medium text-primary underline-offset-2 hover:underline"
                  href="/dashboard/caninos"
                >
                  Mis caninos
                </Link>{" "}
                y abrir el historial desde allí.
              </CardContent>
            </Card>
          ) : (
            <>
              {caninoActual ? (
                <ResumenCanino
                  canino={caninoActual as Tables<"caninos">}
                />
              ) : null}

              <section className="space-y-4" aria-label="Registros clínicos">
                {itemsP.length > 0 ? (
                  <ul className="flex list-none flex-col gap-4 p-0">
                    {itemsP.map((item) => (
                      <li key={item.id}>
                        <HistorialCard item={item} mostrarEditar={false} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Card className="bg-surface-muted/40">
                    <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                      <ClipboardList
                        className="size-10 text-muted-foreground"
                        strokeWidth={1.5}
                      />
                      <p className="max-w-sm text-sm text-muted-foreground">
                        No hay registros clínicos para este canino todavía.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

function ResumenCanino({ canino }: { canino: Tables<"caninos"> }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-xl">{canino.nombre}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {canino.raza?.trim() || "Mestizo"}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <Separator className="mb-4" />
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <CakeSlice className="size-3" strokeWidth={2} aria-hidden />
              Edad
            </dt>
            <dd className="text-sm font-semibold text-foreground">
              {calcularEdad(canino.fecha_nacimiento)}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Scale className="size-3" strokeWidth={2} aria-hidden />
              Peso
            </dt>
            <dd className="text-sm font-semibold text-foreground">
              {canino.peso_kg != null ? `${canino.peso_kg} kg` : "—"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}