-- Historial clínico: cita opcional, próxima cita, nuevas políticas RLS.
-- Sustituye las políticas de 001 (historial_select_owner_or_vet, etc.).

begin;

-- Políticas anteriores
drop policy if exists "historial_select_owner_or_vet" on public.historiales_clinicos;
drop policy if exists "historial_insert_vet" on public.historiales_clinicos;
drop policy if exists "historial_update_vet" on public.historiales_clinicos;

-- Esquema: consulta sin cita vinculada; seguimiento con fecha
alter table public.historiales_clinicos
  alter column cita_id drop not null;

alter table public.historiales_clinicos
  add column if not exists proxima_cita date;

-- Propietario: lee el historial de sus caninos
create policy "propietario_read_historial"
on public.historiales_clinicos
for select
to authenticated
using (
  canino_id in (
    select c.id
    from public.caninos c
    where c.propietario_id = auth.uid()
  )
);

-- Veterinario o administrador: leen todos los historiales
create policy "veterinario_admin_read_historial"
on public.historiales_clinicos
for select
to authenticated
using (
  exists (
    select 1
    from public.usuarios u
    where u.id = auth.uid()
      and u.rol in ('veterinario'::public.rol_usuario, 'administrador'::public.rol_usuario)
  )
);

-- Solo veterinario crea; veterinario_id debe ser el usuario autenticado
create policy "veterinario_insert_historial"
on public.historiales_clinicos
for insert
to authenticated
with check (
  veterinario_id = auth.uid()
  and exists (
    select 1
    from public.usuarios u
    where u.id = auth.uid()
      and u.rol = 'veterinario'::public.rol_usuario
  )
);

-- Solo el veterinario autor puede actualizar su registro
create policy "veterinario_update_historial"
on public.historiales_clinicos
for update
to authenticated
using (
  veterinario_id = auth.uid()
  and exists (
    select 1
    from public.usuarios u
    where u.id = auth.uid()
      and u.rol = 'veterinario'::public.rol_usuario
  )
)
with check (
  veterinario_id = auth.uid()
  and exists (
    select 1
    from public.usuarios u
    where u.id = auth.uid()
      and u.rol = 'veterinario'::public.rol_usuario
  )
);

commit;
