"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const cancelarSchema = z.object({
  citaId: z.string().uuid("Cita inválida"),
});

export type CancelarCitaResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Cancela una cita del usuario autenticado.
 *
 * Reglas (ADR-002, ADR-006):
 *   1. Input validado con Zod antes de tocar la BD.
 *   2. `auth.getUser()` — nunca `getSession()`.
 *   3. Defensa en profundidad: además de RLS (`citas_update_owner_or_staff`)
 *      forzamos `.eq('usuario_id', user.id)` en el UPDATE.
 *   4. Filtros de estado (in pendiente/confirmada) y fecha (> now) garantizan
 *      que sólo se cancelan citas futuras activas; no muta completadas ni
 *      pasadas aunque se intente por error.
 *   5. `revalidatePath` refresca el listado tras la mutación.
 */
export async function cancelarCita(input: {
  citaId: string;
}): Promise<CancelarCitaResult> {
  const parsed = cancelarSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Cita inválida." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  const { error, data } = await supabase
    .from("citas")
    .update({ estado: "cancelada" })
    .eq("id", parsed.data.citaId)
    .eq("usuario_id", user.id)
    .in("estado", ["pendiente", "confirmada"])
    .gt("fecha_hora", new Date().toISOString())
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data) {
    return {
      ok: false,
      error: "No se puede cancelar esta cita. Puede que ya haya pasado o esté cerrada.",
    };
  }

  revalidatePath("/dashboard/citas");
  revalidatePath("/dashboard");
  return { ok: true };
}

/* -------------------------------------------------------------------------- */
/* Acciones exclusivas del veterinario                                        */
/* -------------------------------------------------------------------------- */

const vetActionSchema = z.object({
  citaId: z.string().uuid("Cita inválida"),
});

export type VetActionResult = { ok: true } | { ok: false; error: string };

/**
 * Confirma una cita pendiente. Solo veterinarios.
 * Transición: pendiente → confirmada.
 */
export async function confirmarCita(input: {
  citaId: string;
}): Promise<VetActionResult> {
  const parsed = vetActionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Cita inválida." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Debes iniciar sesión." };

  // Verificar rol veterinario
  const { data: profile } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.rol !== "veterinario" && profile.rol !== "administrador")) {
    return { ok: false, error: "No tienes permisos para esta acción." };
  }

  const { error, data } = await supabase
    .from("citas")
    .update({ estado: "confirmada" })
    .eq("id", parsed.data.citaId)
    .eq("estado", "pendiente")
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) {
    return {
      ok: false,
      error: "No se puede confirmar esta cita. Puede que ya esté confirmada o cancelada.",
    };
  }

  revalidatePath("/dashboard/citas");
  revalidatePath("/dashboard");
  return { ok: true };
}

/**
 * Marca una cita confirmada como completada. Solo veterinarios.
 * Transición: confirmada → completada.
 */
export async function completarCita(input: {
  citaId: string;
}): Promise<VetActionResult> {
  const parsed = vetActionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Cita inválida." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Debes iniciar sesión." };

  // Verificar rol veterinario
  const { data: profile } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.rol !== "veterinario" && profile.rol !== "administrador")) {
    return { ok: false, error: "No tienes permisos para esta acción." };
  }

  const { error, data } = await supabase
    .from("citas")
    .update({ estado: "completada" })
    .eq("id", parsed.data.citaId)
    .eq("estado", "confirmada")
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) {
    return {
      ok: false,
      error: "No se puede completar esta cita. Debe estar confirmada primero.",
    };
  }

  revalidatePath("/dashboard/citas");
  revalidatePath("/dashboard");
  return { ok: true };
}

