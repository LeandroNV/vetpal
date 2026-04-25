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
 *   4. revalidatePath refresca el listado tras la mutación.
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
