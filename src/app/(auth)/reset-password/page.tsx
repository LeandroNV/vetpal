"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordStrengthMeter } from "@/components/shared/password-strength-meter";
import { createClient } from "@/lib/supabase/client";
import { mapSupabaseAuthError } from "@/lib/utils";
import {
  resetPasswordSchema,
  passwordStrength,
  type ResetPasswordInput,
} from "@/lib/validators/auth.schema";

// NOTE: esta página asume que el usuario llega desde el enlace del email de
// recuperación, que pasa por /api/auth/callback y crea una sesión temporal.
// Si la sesión no existe o expiró, supabase.auth.updateUser devolverá un error
// que mapeamos a un mensaje amigable ("El enlace ha expirado…").
export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmar_password: "" },
    mode: "onBlur",
  });

  const password = form.watch("password") ?? "";
  const strength = passwordStrength(password);

  async function onSubmit(values: ResetPasswordInput) {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      form.setError("root", { message: mapSupabaseAuthError(error) });
      return;
    }

    toast.success("Contraseña actualizada");
    router.push("/dashboard");
    router.refresh();
  }

  const rootError = form.formState.errors.root?.message;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 auth-enter auth-enter-1">
        <div
          className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <KeyRound className="size-5" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Nueva contraseña
          </h1>
          <p className="text-base text-muted-foreground">
            Elige una contraseña segura para tu cuenta. La usarás para iniciar
            sesión a partir de ahora.
          </p>
        </div>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
          noValidate
        >
          {rootError && (
            <Alert variant="destructive" role="alert" className="auth-enter">
              <AlertCircle className="size-4" aria-hidden />
              <AlertDescription>{rootError}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="auth-enter auth-enter-2">
                <FormLabel>Nueva contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Mínimo 8 caracteres"
                      className="pr-10"
                      autoFocus
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden />
                      ) : (
                        <Eye className="size-4" aria-hidden />
                      )}
                    </button>
                  </div>
                </FormControl>
                <PasswordStrengthMeter
                  strength={strength}
                  hasPassword={password.length > 0}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmar_password"
            render={({ field }) => (
              <FormItem className="auth-enter auth-enter-3">
                <FormLabel>Confirma tu contraseña</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repite tu contraseña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="press-feedback w-full auth-enter auth-enter-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Guardando…
              </>
            ) : (
              "Actualizar contraseña"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground auth-enter auth-enter-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Volver al login
        </Link>
      </p>
    </div>
  );
}
