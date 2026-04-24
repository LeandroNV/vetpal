-- =============================================================================
-- VETPAL · Migration 003 — Seed del catálogo de servicios
-- -----------------------------------------------------------------------------
-- Propósito: poblar public.servicios con las 10 ofertas reales de VETPAL
-- descritas en el PDF §2.4 (salud preventiva, estética, nutrición, guardería
-- y servicios funerarios).
--
-- Decisiones clave (skill `supabase-postgres-best-practices`):
--
--   1. UUIDs fijos en formato v4: los servicios comparten id entre dev, staging
--      y producción. Esto estabiliza los enlaces (`/dashboard/citas/nueva?servicio=<uuid>`),
--      facilita el testing y elimina la fragilidad de IDs aleatorios por entorno.
--
--   2. `ON CONFLICT (id) DO NOTHING`: la migración es replay-safe. Si un
--      `supabase db reset` o una re-ejecución manual dispara el INSERT con ids
--      existentes, no falla ni duplica registros.
--
--   3. `activo = true` por defecto en todos los seeds. Los retiros futuros se
--      hacen marcando `activo = false` (soft delete), respetando la decisión
--      de architecture.md §2.3.
-- =============================================================================

insert into public.servicios (id, nombre, categoria, descripcion, precio, duracion_minutos, activo) values
  -- Salud preventiva
  ('00000000-0000-4000-8000-000000000001', 'Consulta general',              'salud_preventiva', 'Revisión completa del estado de salud del canino',           45000,  30, true),
  ('00000000-0000-4000-8000-000000000002', 'Vacunación',                    'salud_preventiva', 'Aplicación de vacunas según esquema de vacunación',          35000,  20, true),
  ('00000000-0000-4000-8000-000000000003', 'Desparasitación',               'salud_preventiva', 'Tratamiento antiparasitario interno y externo',              25000,  15, true),
  -- Estética
  ('00000000-0000-4000-8000-000000000004', 'Baño y secado',                 'estetica',         'Baño profesional con productos especializados',              40000,  60, true),
  ('00000000-0000-4000-8000-000000000005', 'Corte de pelo',                 'estetica',         'Corte estético según raza y preferencia del propietario',    55000,  90, true),
  ('00000000-0000-4000-8000-000000000006', 'Baño, corte y arreglo completo','estetica',         'Servicio completo de estética canina',                       85000, 120, true),
  -- Nutrición
  ('00000000-0000-4000-8000-000000000007', 'Consulta nutricional',          'nutricion',        'Evaluación y plan de alimentación personalizado',            50000,  45, true),
  -- Guardería
  ('00000000-0000-4000-8000-000000000008', 'Guardería día completo',        'guarderia',        'Cuidado y supervisión por 8 horas',                          35000, 480, true),
  ('00000000-0000-4000-8000-000000000009', 'Hotel canino (por noche)',      'guarderia',        'Hospedaje seguro con atención 24 horas',                     55000,1440, true),
  -- Funerarios
  ('00000000-0000-4000-8000-000000000010', 'Cremación individual',          'funerarios',       'Servicio de cremación con entrega de cenizas',              250000,  60, true)
on conflict (id) do nothing;

comment on table public.servicios is 'Catálogo de servicios veterinarios. Seed en 003 con 10 servicios reales del PDF §2.4 e ids fijos por entorno.';
