import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { HistorialForm } from "@/components/forms/historial-form";
import type { CitaHistorialOption } from "@/components/forms/historial-form";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { esVeterinario } from "@/lib/utils";
import type { Tables } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type CaninoFila = {
  id: string;
  nombre: string;
  raza: string | null;
  peso_kg: number | null;
  fecha_nacimiento: string | null;
  sexo: string;
  propietario: { nombre_completo: string } | null;
};

function ordenarCaninos(a: CaninoFila, b: CaninoFila) {
  const pa = a.propietario?.nombre_completo ?? "";
  const pb = b.propietario?.nombre_completo ?? "";
  if (pa !== pb) return pa.localeCompare(pb, "es");
  return a.nombre.localeCompare(b.nombre, "es");
}

/**
 * Next.js 16 — `params` se consume como Promise con `await`.
 */
export default async function HistorialEditarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: perfil, error: pe } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (pe || !perfil || !esVeterinario(perfil.rol)) {
    redirect("/dashboard");
  }

  const { data: registro, error: re } = await supabase
    .from("historiales_clinicos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (re || !registro) {
    notFound();
  }

  const { data: caninosData } = await supabase
    .from("caninos")
    .select(
      "id, nombre, raza, peso_kg, fecha_nacimiento, sexo, propietario:usuarios!caninos_propietario_id_fkey ( nombre_completo )"
    );

  const caninos = (caninosData as unknown as CaninoFila[] | null)?.sort(
    ordenarCaninos
  ) ?? [];

  const { data: histCitas } = await supabase
    .from("historiales_clinicos")
    .select("cita_id, id")
    .not("cita_id", "is", null);
  const usados = new Set(
    (histCitas ?? [])
      .filter((h) => h.id !== registro.id)
      .map((h) => h.cita_id)
      .filter((x): x is string => typeof x === "string" && x.length > 0)
  );

  const { data: citasRaw } = await supabase
    .from("citas")
    .select(
      "id, fecha_hora, estado, canino_id, canino:caninos!citas_canino_id_fkey ( nombre, raza ), servicio:servicios!citas_servicio_id_fkey ( nombre )"
    )
    .eq("estado", "completada")
    .order("fecha_hora", { ascending: false });

  let citas: CitaHistorialOption[] = (citasRaw ?? []) as unknown as CitaHistorialOption[];
  citas = citas.filter((c) => !usados.has(c.id));

  if (registro.cita_id) {
    const esta = citas.some((c) => c.id === registro.cita_id);
    if (!esta) {
      const { data: citaPropia } = await supabase
        .from("citas")
        .select(
          "id, fecha_hora, canino_id, canino:caninos!citas_canino_id_fkey ( nombre, raza ), servicio:servicios!citas_servicio_id_fkey ( nombre )"
        )
        .eq("id", registro.cita_id)
        .maybeSingle();
      if (citaPropia) {
        citas = [citaPropia as unknown as CitaHistorialOption, ...citas];
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <p>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={
              registro.canino_id
                ? `/dashboard/historial?canino=${registro.canino_id}`
                : "/dashboard/historial"
            }
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </p>
      <HistorialForm
        mode="edit"
        registro={registro as Tables<"historiales_clinicos">}
        caninos={caninos}
        citas={citas}
        veterinarioId={user.id}
      />
    </div>
  );
}
