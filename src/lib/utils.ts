import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AuthError } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Traduce errores de Supabase Auth a mensajes amigables en español.
 * Cubre los códigos más comunes (`error_code` del nuevo formato y
 * `message` legacy) sin exponer detalles técnicos al usuario final.
 */
export function mapSupabaseAuthError(error: AuthError | { message: string; code?: string } | null | undefined): string {
  if (!error) return "Ocurrió un error inesperado. Intenta de nuevo.";

  const code = ("code" in error && error.code) || "";
  const message = error.message?.toLowerCase() ?? "";

  if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.";
  }
  if (code === "user_already_registered" || message.includes("user already registered") || message.includes("already been registered")) {
    return "Este email ya está registrado. Intenta iniciar sesión.";
  }
  if (code === "weak_password" || message.includes("password should be")) {
    return "La contraseña es demasiado débil. Usa al menos 8 caracteres, una mayúscula y un número.";
  }
  if (code === "over_email_send_rate_limit" || message.includes("rate limit") || message.includes("too many requests")) {
    return "Has hecho demasiados intentos. Espera unos minutos y vuelve a intentar.";
  }
  if (code === "otp_expired" || message.includes("otp expired") || message.includes("token has expired")) {
    return "El enlace ha expirado. Solicita uno nuevo.";
  }
  if (code === "user_not_found" || message.includes("user not found")) {
    return "No encontramos una cuenta con ese email.";
  }
  if (code === "signup_disabled" || message.includes("signups not allowed")) {
    return "El registro está deshabilitado temporalmente.";
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "Problema de conexión. Verifica tu internet e intenta de nuevo.";
  }

  return error.message || "Ocurrió un error inesperado. Intenta de nuevo.";
}

/**
 * Calcula la edad a partir de una fecha de nacimiento en formato ISO (yyyy-mm-dd)
 * o ISO 8601. Devuelve una cadena legible en español:
 * - "Menos de 1 mes" para edades < 30 días
 * - "N meses" cuando es < 12 meses
 * - "N años" cuando es >= 12 meses
 * Retorna "—" si la fecha es nula, inválida o está en el futuro.
 */
export function calcularEdad(
  fechaNacimiento: string | null | undefined
): string {
  if (!fechaNacimiento) return "—";

  const nacimiento = new Date(fechaNacimiento);
  if (Number.isNaN(nacimiento.getTime())) return "—";

  const hoy = new Date();
  const meses =
    (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
    (hoy.getMonth() - nacimiento.getMonth()) -
    (hoy.getDate() < nacimiento.getDate() ? 1 : 0);

  if (meses < 0) return "—";
  if (meses < 1) return "Menos de 1 mes";
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;

  const años = Math.floor(meses / 12);
  return `${años} ${años === 1 ? "año" : "años"}`;
}

/**
 * Formatea una fecha a texto legible en español (es-ES): "24 de abril de 2026".
 * Acepta strings ISO o instancias Date. Devuelve "—" si la entrada es nula o
 * inválida.
 */
export function formatearFecha(
  fecha: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!fecha) return "—";
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  if (Number.isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(d);
}
