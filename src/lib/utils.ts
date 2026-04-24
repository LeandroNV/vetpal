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
