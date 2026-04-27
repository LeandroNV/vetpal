"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const schema = z.object({ caninoId: z.string().uuid() });

export type EliminarCaninoResult = { ok: true } | { ok: false; error: string };

/**
 * Elimina un canino del usuario autenticado.
 *
 * Reglas:
 *   1. Input validado con Zod.
 *   2. auth.getUser() — nunca getSession().
 *   3. Defensa en profundidad: además de RLS (`caninos_delete_owner`)
 *      forzamos `.eq('propietario_id', user.id)` en el DELETE.
 *   4. Verifica FK: rechaza si el canino tiene citas activas o historial.
 *   5. revalidatePath refresca el listado tras la mutación.
 */
export async function eliminarCanino(input: {
  caninoId: string;
}): Promise<EliminarCaninoResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "ID inválido." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  // Verificar que el canino pertenece al usuario
  const { data: canino } = await supabase
    .from("caninos")
    .select("id")
    .eq("id", parsed.data.caninoId)
    .eq("propietario_id", user.id)
    .single();

  if (!canino) {
    return { ok: false, error: "No autorizado." };
  }

  // FK check: verificar citas activas (pendiente o confirmada)
  const { count: citasActivas } = await supabase
    .from("citas")
    .select("*", { count: "exact", head: true })
    .eq("canino_id", parsed.data.caninoId)
    .in("estado", ["pendiente", "confirmada"]);

  if (citasActivas && citasActivas > 0) {
    return {
      ok: false,
      error: `Este canino tiene ${citasActivas} cita${citasActivas > 1 ? "s" : ""} activa${citasActivas > 1 ? "s" : ""}. Cancélalas antes de eliminarlo.`,
    };
  }

  // FK check: verificar historial clínico
  const { count: registrosHistorial } = await supabase
    .from("historiales_clinicos")
    .select("*", { count: "exact", head: true })
    .eq("canino_id", parsed.data.caninoId);

  if (registrosHistorial && registrosHistorial > 0) {
    return {
      ok: false,
      error: `Este canino tiene ${registrosHistorial} registro${registrosHistorial > 1 ? "s" : ""} en su historial clínico. No se puede eliminar un canino con historial.`,
    };
  }

  const { error } = await supabase
    .from("caninos")
    .delete()
    .eq("id", parsed.data.caninoId)
    .eq("propietario_id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/caninos");
  revalidatePath("/dashboard");
  return { ok: true };
}
