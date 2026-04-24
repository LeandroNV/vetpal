-- =============================================================================
-- VETPAL · Migration 002 — Trigger on_auth_user_created
-- -----------------------------------------------------------------------------
-- Propósito: sembrar automáticamente public.usuarios cuando se crea un registro
-- en auth.users (ya sea vía email/password signup, OAuth, o magic link).
--
-- SECURITY DEFINER es necesario porque:
--   1. public.usuarios tiene RLS habilitado y el usuario recién creado NO tiene
--      sesión al momento del INSERT (ocurre dentro del flujo interno de auth).
--   2. El trigger se dispara en el contexto del servicio de auth, que sin
--      SECURITY DEFINER no puede escribir en el esquema public.
--
-- Se fija `search_path = ''` (empty) para evitar search-path hijacking; todas
-- las referencias internas usan nombres totalmente calificados
-- (public.usuarios, public.rol_usuario, auth.users).
--
-- Ver architecture.md · ADR-010:
--   `nombre_completo` se guarda aquí sólo como DATO DE PERFIL, nunca se usa
--   para autorización. La autorización se hará con `raw_app_meta_data.role`
--   (editable sólo server-side), no con `raw_user_meta_data`.
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.usuarios (id, email, nombre_completo, rol)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'nombre_completo',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    'propietario'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

comment on function public.handle_new_user() is
  'Crea el perfil en public.usuarios tras un signup en auth.users. SECURITY DEFINER + search_path='''' (best-practice Supabase). Ver ADR-010 en architecture.md.';

-- Idempotente: si la migración se reejecuta, primero elimina el trigger previo.
drop trigger if exists after_auth_user_created on auth.users;

-- Nota: no se agrega `comment on trigger` porque requiere ser owner de
-- `auth.users` (owner = supabase_auth_admin). El propósito del trigger queda
-- documentado en el comment de la función y en esta cabecera.
create trigger after_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
