/**
 * Constantes de dominio para el ciclo de vida de una cita.
 * Refleja el CHECK constraint en public.citas.estado (migración 001).
 */
export const ESTADOS_CITA = [
  "pendiente",
  "confirmada",
  "completada",
  "cancelada",
] as const;

export type EstadoCita = (typeof ESTADOS_CITA)[number];

export const ESTADO_BADGE: Record<
  EstadoCita,
  { label: string; className: string }
> = {
  pendiente: {
    label: "Pendiente",
    className: "bg-warning/10 text-warning",
  },
  confirmada: {
    label: "Confirmada",
    className: "bg-success/10 text-success",
  },
  completada: {
    label: "Completada",
    className: "bg-muted text-muted-foreground",
  },
  cancelada: {
    label: "Cancelada",
    className: "bg-destructive/10 text-destructive",
  },
};

export function esEstadoCita(v: string): v is EstadoCita {
  return (ESTADOS_CITA as readonly string[]).includes(v);
}

/**
 * Determina si una cita puede ser cancelada por el propietario:
 * sólo si está pendiente/confirmada y aún no ha ocurrido.
 */
export function esCancelable(
  estado: string,
  fechaHora: string | Date
): boolean {
  if (estado !== "pendiente" && estado !== "confirmada") return false;
  const d = typeof fechaHora === "string" ? new Date(fechaHora) : fechaHora;
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() > Date.now();
}
