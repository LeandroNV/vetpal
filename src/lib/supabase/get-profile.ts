import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Rol = Database["public"]["Enums"]["rol_usuario"];

export type AppProfile = {
  id: string;
  nombre_completo: string;
  rol: Rol;
};

/**
 * Obtiene el usuario autenticado y su perfil de `public.usuarios`.
 *
 * Usa `React.cache()` para deduplicar la query dentro del mismo
 * request (layout + page). No tiene efecto cross-request.
 *
 * Retorna `null` si no hay sesión activa.
 */
export const getAuthProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("usuarios")
    .select("id, nombre_completo, rol")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    user,
    profile: profile as AppProfile,
  };
});
