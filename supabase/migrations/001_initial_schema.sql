-- =============================================================================
-- VETPAL — 001_initial_schema.sql
-- -----------------------------------------------------------------------------
-- Esquema inicial según Entrega Previa 2 (PMI/PMBOK® 7ma ed.) §5–§6:
--   Modelo Entidad-Relación + Diccionario de Datos.
--
-- Ajustes sobre el PDF (documentados en architecture.md):
--   * usuarios: se elimina auth_user_id. La PK `id` referencia directamente
--     a auth.users(id) ON DELETE CASCADE (1:1).
--   * usuarios: se agrega columna `rol` (ENUM rol_usuario) para soportar
--     la relación historiales_clinicos.veterinario_id → usuarios.id.
--   * servicios: los campos se infieren a partir del enunciado de casos de
--     uso (PDF §2.4). El PDF no entrega diccionario para esta tabla.
--
-- RLS: habilitado en TODAS las tablas del esquema public (ADR-009).
-- Seguridad: el rol se valida vía subconsulta a public.usuarios. NO se usa
-- raw_user_meta_data en políticas (ADR-010, skill supabase §5).
--
-- ESTE ARCHIVO NO SE EJECUTA AUTOMÁTICAMENTE. Se aplicará con:
--   supabase link --project-ref rwxtqixsgfdaozbeivsy
--   supabase db push
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Extensiones
-- -----------------------------------------------------------------------------
create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- 2. Tipos ENUM
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'rol_usuario') then
    create type public.rol_usuario as enum (
      'propietario',
      'veterinario',
      'administrador'
    );
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 3. Función utilitaria: set_updated_at()
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- =============================================================================
-- 4. TABLA: usuarios   (PDF §6.1)
-- -----------------------------------------------------------------------------
-- NOTA: PK = auth.users.id  ➜  relación 1:1 con la identidad de Supabase Auth.
--       Al borrar el usuario de auth, el perfil se borra en cascada.
-- =============================================================================
create table if not exists public.usuarios (
  id                uuid         primary key references auth.users(id) on delete cascade,
  nombre_completo   varchar(150) not null,
  email             varchar(255) not null unique,
  telefono          varchar(20),
  direccion         text,
  rol               public.rol_usuario not null default 'propietario',
  created_at        timestamptz  not null default now(),
  updated_at        timestamptz  not null default now()
);

create trigger trg_usuarios_set_updated_at
before update on public.usuarios
for each row execute function public.set_updated_at();

comment on table  public.usuarios is 'Perfil de dominio de los usuarios. PK referencia auth.users.id (1:1).';
comment on column public.usuarios.rol is 'Rol de aplicación. Se valida vía subconsulta en políticas RLS.';

-- =============================================================================
-- 5. TABLA: caninos   (PDF §6.2)
-- =============================================================================
create table if not exists public.caninos (
  id                uuid         primary key default gen_random_uuid(),
  propietario_id    uuid         not null references public.usuarios(id) on delete cascade,
  nombre            varchar(100) not null,
  raza              varchar(100),
  sexo              varchar(10)  not null check (sexo in ('M', 'F')),
  fecha_nacimiento  date,
  peso_kg           numeric(5,2) check (peso_kg > 0),
  created_at        timestamptz  not null default now()
);

create index if not exists idx_caninos_propietario_id on public.caninos (propietario_id);

comment on table public.caninos is 'Caninos registrados por los propietarios (PDF §6.2).';

-- =============================================================================
-- 6. TABLA: servicios   (inferida — PDF §2.4)
-- =============================================================================
create table if not exists public.servicios (
  id                uuid           primary key default gen_random_uuid(),
  nombre            varchar(150)   not null,
  categoria         varchar(30)    not null
                    check (categoria in ('salud_preventiva','estetica','nutricion','guarderia','funerarios')),
  descripcion       text,
  precio            numeric(10,2)  not null check (precio > 0),
  duracion_minutos  integer        not null check (duracion_minutos > 0),
  activo            boolean        not null default true,
  created_at        timestamptz    not null default now()
);

create index if not exists idx_servicios_categoria on public.servicios (categoria);
create index if not exists idx_servicios_activo    on public.servicios (activo);

comment on table public.servicios is 'Catálogo de servicios veterinarios. Campos inferidos de PDF §2.4.';

-- =============================================================================
-- 7. TABLA: citas   (PDF §6.3)
-- =============================================================================
create table if not exists public.citas (
  id             uuid         primary key default gen_random_uuid(),
  usuario_id     uuid         not null references public.usuarios(id)  on delete cascade,
  canino_id      uuid         not null references public.caninos(id)   on delete cascade,
  servicio_id    uuid         not null references public.servicios(id) on delete restrict,
  fecha_hora     timestamptz  not null,
  estado         varchar(20)  not null default 'pendiente'
                 check (estado in ('pendiente','confirmada','completada','cancelada')),
  observaciones  text,
  created_at     timestamptz  not null default now()
);

create index if not exists idx_citas_usuario_id   on public.citas (usuario_id);
create index if not exists idx_citas_canino_id    on public.citas (canino_id);
create index if not exists idx_citas_fecha_hora   on public.citas (fecha_hora);
create index if not exists idx_citas_estado       on public.citas (estado);

comment on table public.citas is 'Reservas de servicios (PDF §6.3). Estado controla el ciclo de vida.';

-- =============================================================================
-- 8. TABLA: historiales_clinicos   (PDF §6.4)
-- -----------------------------------------------------------------------------
-- NOTA: cita_id es UNIQUE ➜ relación 1:1 con citas.
--       veterinario_id debe tener rol='veterinario' (validado por política RLS
--       de INSERT + trigger opcional en fases posteriores).
-- =============================================================================
create table if not exists public.historiales_clinicos (
  id                uuid         primary key default gen_random_uuid(),
  cita_id           uuid         not null unique references public.citas(id)    on delete cascade,
  canino_id         uuid         not null references public.caninos(id)         on delete cascade,
  veterinario_id    uuid         not null references public.usuarios(id)        on delete restrict,
  motivo_consulta   text         not null,
  diagnostico       text,
  tratamiento       text,
  medicamentos      text,
  created_at        timestamptz  not null default now()
);

create index if not exists idx_historial_canino_id       on public.historiales_clinicos (canino_id);
create index if not exists idx_historial_veterinario_id  on public.historiales_clinicos (veterinario_id);

comment on table public.historiales_clinicos is 'Registros clínicos por cita (PDF §6.4).';

-- =============================================================================
-- 9. TABLA: pagos   (PDF §6.5)
-- =============================================================================
create table if not exists public.pagos (
  id                   uuid           primary key default gen_random_uuid(),
  cita_id              uuid           not null unique references public.citas(id) on delete restrict,
  monto                numeric(10,2)  not null check (monto > 0),
  metodo_pago          varchar(50)    not null
                       check (metodo_pago in ('efectivo','tarjeta_credito','transferencia','pse')),
  estado               varchar(20)    not null default 'pendiente'
                       check (estado in ('pendiente','aprobado','rechazado','reembolsado')),
  referencia_externa   varchar(255)   unique,
  fecha_pago           timestamptz
);

create index if not exists idx_pagos_estado on public.pagos (estado);

comment on table public.pagos is 'Transacciones asociadas 1:1 con una cita (PDF §6.5).';

-- =============================================================================
-- 10. ROW LEVEL SECURITY — habilitación global (ADR-009)
-- =============================================================================
alter table public.usuarios              enable row level security;
alter table public.caninos               enable row level security;
alter table public.servicios             enable row level security;
alter table public.citas                 enable row level security;
alter table public.historiales_clinicos  enable row level security;
alter table public.pagos                 enable row level security;

-- -----------------------------------------------------------------------------
-- 10.1 Helper: función SECURITY DEFINER que retorna el rol del usuario actual.
-- -----------------------------------------------------------------------------
-- NOTA: se usa en políticas para evitar recursión infinita al consultar
-- public.usuarios desde sus propias políticas. Permanece en schema public con
-- REVOKE explícito para mitigar exposición (seguiremos mejorando en futuras
-- migraciones moviéndola a un schema privado).
create or replace function public.current_user_rol()
returns public.rol_usuario
language sql
security definer
set search_path = public
stable
as $$
  select rol from public.usuarios where id = auth.uid();
$$;

revoke all on function public.current_user_rol() from public;
grant execute on function public.current_user_rol() to authenticated;

-- -----------------------------------------------------------------------------
-- 10.2 Políticas — usuarios
-- -----------------------------------------------------------------------------
-- NOTA: cada usuario autenticado solo ve/edita su propio perfil.
--       El INSERT inicial del perfil lo dispara el cliente tras sign-up.
create policy "usuarios_select_self"
  on public.usuarios for select
  to authenticated
  using (id = auth.uid());

create policy "usuarios_insert_self"
  on public.usuarios for insert
  to authenticated
  with check (id = auth.uid());

create policy "usuarios_update_self"
  on public.usuarios for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- -----------------------------------------------------------------------------
-- 10.3 Políticas — caninos
-- -----------------------------------------------------------------------------
-- NOTA: el propietario tiene control total; veterinario/administrador pueden
-- leer todos los caninos para atender consultas y ver historial.
create policy "caninos_select_owner_or_staff"
  on public.caninos for select
  to authenticated
  using (
    propietario_id = auth.uid()
    or public.current_user_rol() in ('veterinario','administrador')
  );

create policy "caninos_insert_owner"
  on public.caninos for insert
  to authenticated
  with check (propietario_id = auth.uid());

create policy "caninos_update_owner"
  on public.caninos for update
  to authenticated
  using (propietario_id = auth.uid())
  with check (propietario_id = auth.uid());

create policy "caninos_delete_owner"
  on public.caninos for delete
  to authenticated
  using (propietario_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 10.4 Políticas — servicios
-- -----------------------------------------------------------------------------
-- NOTA: catálogo visible para todos los autenticados; mutaciones solo admin.
create policy "servicios_select_authenticated"
  on public.servicios for select
  to authenticated
  using (true);

create policy "servicios_write_admin"
  on public.servicios for all
  to authenticated
  using (public.current_user_rol() = 'administrador')
  with check (public.current_user_rol() = 'administrador');

-- -----------------------------------------------------------------------------
-- 10.5 Políticas — citas
-- -----------------------------------------------------------------------------
-- NOTA: propietario ve/crea/edita sus propias citas; veterinario y admin ven
-- todas y pueden actualizar el estado (confirmar, completar, cancelar).
create policy "citas_select_owner_or_staff"
  on public.citas for select
  to authenticated
  using (
    usuario_id = auth.uid()
    or public.current_user_rol() in ('veterinario','administrador')
  );

create policy "citas_insert_owner"
  on public.citas for insert
  to authenticated
  with check (usuario_id = auth.uid());

create policy "citas_update_owner_or_staff"
  on public.citas for update
  to authenticated
  using (
    usuario_id = auth.uid()
    or public.current_user_rol() in ('veterinario','administrador')
  )
  with check (
    usuario_id = auth.uid()
    or public.current_user_rol() in ('veterinario','administrador')
  );

create policy "citas_delete_owner"
  on public.citas for delete
  to authenticated
  using (usuario_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 10.6 Políticas — historiales_clinicos
-- -----------------------------------------------------------------------------
-- NOTA: solo el propietario del canino atendido o el veterinario tratante
-- pueden leer el historial. La escritura queda restringida a usuarios con
-- rol 'veterinario' (y el veterinario_id debe coincidir con auth.uid()).
create policy "historial_select_owner_or_vet"
  on public.historiales_clinicos for select
  to authenticated
  using (
    veterinario_id = auth.uid()
    or exists (
      select 1 from public.caninos c
      where c.id = historiales_clinicos.canino_id
        and c.propietario_id = auth.uid()
    )
    or public.current_user_rol() = 'administrador'
  );

create policy "historial_insert_vet"
  on public.historiales_clinicos for insert
  to authenticated
  with check (
    veterinario_id = auth.uid()
    and public.current_user_rol() = 'veterinario'
  );

create policy "historial_update_vet"
  on public.historiales_clinicos for update
  to authenticated
  using (
    veterinario_id = auth.uid()
    and public.current_user_rol() = 'veterinario'
  )
  with check (
    veterinario_id = auth.uid()
    and public.current_user_rol() = 'veterinario'
  );

-- -----------------------------------------------------------------------------
-- 10.7 Políticas — pagos
-- -----------------------------------------------------------------------------
-- NOTA: el propietario ve los pagos de sus propias citas. Las escrituras
-- se realizan server-side con service_role (desde Edge Functions o Route
-- Handlers privilegiados); por eso NO se abre política de INSERT/UPDATE a
-- usuarios autenticados. El administrador puede leer todo.
create policy "pagos_select_owner_or_admin"
  on public.pagos for select
  to authenticated
  using (
    public.current_user_rol() = 'administrador'
    or exists (
      select 1 from public.citas c
      where c.id = pagos.cita_id
        and c.usuario_id = auth.uid()
    )
  );

commit;
