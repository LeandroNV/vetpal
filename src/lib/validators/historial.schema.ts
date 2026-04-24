import { z } from "zod";

export const historialSchema = z.object({
  canino_id: z.string().uuid("Selecciona un canino"),
  cita_id: z.union([z.string().uuid(), z.literal("")]).optional(),
  motivo_consulta: z.string().min(3, "Requerido").max(500),
  diagnostico: z.union([z.string().max(1000), z.literal("")]),
  tratamiento: z.union([z.string().max(1000), z.literal("")]),
  medicamentos: z.union([z.string().max(1000), z.literal("")]),
  proxima_cita: z.union([z.string(), z.literal("")]).optional(),
});

export type HistorialInput = z.infer<typeof historialSchema>;
