/**
 * Constantes de dominio para el catálogo de servicios.
 * Refleja el CHECK constraint en public.servicios.categoria (migración 001).
 */
export const CATEGORIAS = [
  "salud_preventiva",
  "estetica",
  "nutricion",
  "guarderia",
  "funerarios",
] as const;

export type CategoriaServicio = (typeof CATEGORIAS)[number];

export const CATEGORIA_LABEL: Record<CategoriaServicio, string> = {
  salud_preventiva: "Salud Preventiva",
  estetica: "Estética",
  nutricion: "Nutrición",
  guarderia: "Guardería",
  funerarios: "Funerarios",
};

/** Type guard para discriminar strings arbitrarios contra el enum. */
export function esCategoriaServicio(v: string): v is CategoriaServicio {
  return (CATEGORIAS as readonly string[]).includes(v);
}
