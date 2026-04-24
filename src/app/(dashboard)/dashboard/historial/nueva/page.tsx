import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { HistorialForm } from "@/components/forms/historial-form";
import type { CitaHistorialOption } from "@/components/forms/historial-form";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { esVeterinario } from "@/lib/utils";

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

export default async function HistorialNuevaPage() {
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
    .select("cita_id")
    .not("cita_id", "is", null);
  const usados = new Set(
    (histCitas ?? [])
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

  const base = (citasRaw ?? []) as unknown as CitaHistorialOption[];
  const citas: CitaHistorialOption[] = base.filter((c) => !usados.has(c.id));

  if (caninos.length === 0) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/historial">
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="font-display">No hay caninos</CardTitle>
            <CardDescription>
              Debe existir al menos un canino en el sistema para registrar una
              consulta.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <HistorialForm
        mode="create"
        caninos={caninos}
        citas={citas}
        veterinarioId={user.id}
      />
    </div>
  );
}
