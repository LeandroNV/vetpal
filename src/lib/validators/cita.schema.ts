import { z } from "zod";

/** Mínimo margen exigido para agendar: 1 hora en el futuro. */
const MIN_MARGEN_MS = 60 * 60 * 1000;

export const citaSchema = z.object({
  canino_id: z.string().uuid("Selecciona un canino"),
  servicio_id: z.string().uuid("Selecciona un servicio"),
  fecha_hora: z
    .string()
    .min(1, "Selecciona fecha y hora")
    .refine(
      (v) => {
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return false;
        return d.getTime() >= Date.now() + MIN_MARGEN_MS;
      },
      { message: "La cita debe ser al menos 1 hora en el futuro" }
    ),
  observaciones: z.string().trim().max(500, "Máximo 500 caracteres"),
});

export type CitaInput = z.infer<typeof citaSchema>;
