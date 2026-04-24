import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresa tu email")
    .email("Email inválido"),
  password: z
    .string()
    .min(6, "Mínimo 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nombre_completo: z
      .string()
      .trim()
      .min(2, "Mínimo 2 caracteres")
      .max(150, "Máximo 150 caracteres"),
    email: z
      .string()
      .min(1, "Ingresa tu email")
      .email("Email inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
      .regex(/[0-9]/, "Debe tener al menos un número"),
    confirmar_password: z.string(),
  })
  .refine((data) => data.password === data.confirmar_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmar_password"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresa tu email")
    .email("Email inválido"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
      .regex(/[0-9]/, "Debe tener al menos un número"),
    confirmar_password: z.string(),
  })
  .refine((data) => data.password === data.confirmar_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmar_password"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Evalúa la fuerza de la contraseña (0 a 3).
 * 0 = sin requisitos, 3 = todos los requisitos cumplidos.
 */
export function passwordStrength(password: string): 0 | 1 | 2 | 3 {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  return score as 0 | 1 | 2 | 3;
}
