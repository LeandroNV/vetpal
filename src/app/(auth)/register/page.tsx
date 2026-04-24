"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  registerSchema,
  passwordStrength,
  type RegisterInput,
} from "@/lib/validators/auth.schema";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre_completo: "",
      email: "",
      password: "",
      confirmar_password: "",
    },
    mode: "onBlur",
  });

  const password = form.watch("password") ?? "";
  const strength = passwordStrength(password);

  async function onSubmit(values: RegisterInput) {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        data: { nombre_completo: values.nombre_completo },
      },
    });

    if (error) {
      form.setError("root", { message: mapSupabaseAuthError(error) });
      return;
    }

    setRegisteredEmail(values.email);
  }

  if (registeredEmail) {
    return (
      <Card className="auth-enter auth-enter-1 shadow-(--shadow-soft)">
        <CardHeader className="items-center gap-3 text-center">
          <div
            className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <MailCheck className="size-6" />
          </div>
          <CardTitle className="font-display text-2xl">
            Revisa tu email
          </CardTitle>
          <CardDescription className="max-w-sm">
            Enviamos un enlace de confirmación a{" "}
            <span className="font-medium text-foreground">
              {registeredEmail}
            </span>
            . Haz clic en él para activar tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="press-feedback w-full"
          >
            <Link href="/login">Volver al login</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            ¿No llegó el email? Revisa la carpeta de spam o{" "}
            <button
              type="button"
              onClick={() => setRegisteredEmail(null)}
              className="text-primary underline-offset-4 hover:underline"
            >
              intenta de nuevo
            </button>
            .
          </p>
        </CardContent>
      </Card>
    );
  }

  const rootError = form.formState.errors.root?.message;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 auth-enter auth-enter-1">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Crea tu cuenta
        </h1>
        <p className="text-base text-muted-foreground">
          Empieza a cuidar a tu mejor amigo en minutos.
        </p>
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
            name="nombre_completo"
            render={({ field }) => (
              <FormItem className="auth-enter auth-enter-2">
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder="Ana López"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="auth-enter auth-enter-3">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="tu@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="auth-enter auth-enter-4">
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Mínimo 8 caracteres"
                      className="pr-10"
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
              <FormItem className="auth-enter auth-enter-5">
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
            className="press-feedback w-full auth-enter auth-enter-5"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Creando cuenta…
              </>
            ) : (
              "Crear cuenta"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground auth-enter auth-enter-5">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

