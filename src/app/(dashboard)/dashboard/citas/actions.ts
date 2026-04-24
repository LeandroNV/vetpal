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
