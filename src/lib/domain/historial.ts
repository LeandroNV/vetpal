export const MOTIVOS_COMUNES = [
  "Consulta de rutina",
  "Vacunación",
  "Desparasitación",
  "Control post-operatorio",
  "Urgencia",
  "Revisión dermatológica",
  "Revisión dental",
  "Otro",
] as const;

export type MotivoComun = (typeof MOTIVOS_COMUNES)[number];
