import { z } from "zod";

/**
 * Schema del formulario de canino. Todos los campos se manejan como strings
 * para simplificar la integración con react-hook-form + `<input>` nativo.
 * La sanitización (string vacío → null, "123.4" → 123.4) ocurre en el
 * handler `onSubmit` antes de persistir en Supabase.
 */
export const caninoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
  raza: z
    .string()
    .trim()
    .max(100, "Máximo 100 caracteres"),
  sexo: z.enum(["M", "F"], { message: "Selecciona el sexo" }),
  fecha_nacimiento: z.string().refine(
    (v) => {
      if (v === "") return true;
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return false;
      return d.getTime() <= Date.now();
    },
    { message: "Fecha inválida o futura" }
  ),
  peso_kg: z.string().refine(
    (v) => {
      if (v === "") return true;
      const n = Number(v);
      return !Number.isNaN(n) && n > 0 && n <= 200;
    },
    { message: "Debe ser un número entre 0.01 y 200" }
  ),
});

export type CaninoInput = z.infer<typeof caninoSchema>;
