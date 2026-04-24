"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Loader2, MailCheck } from "lucide-react";

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
import { createClient } from "@/lib/supabase/client";
import { mapSupabaseAuthError } from "@/lib/utils";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validators/auth.schema";

export default function ForgotPasswordPage() {
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: ForgotPasswordInput) {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    });

    if (error) {
      form.setError("root", { message: mapSupabaseAuthError(error) });
      return;
    }

    setSentEmail(email);
  }

  if (sentEmail) {
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
            Si existe una cuenta asociada a{" "}
            <span className="font-medium text-foreground">{sentEmail}</span>,
            recibirás un enlace para restablecer tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="press-feedback w-full"
          >
            <Link href="/login">
              <ArrowLeft className="size-4" aria-hidden />
              Volver al login
            </Link>
          </Button>
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
          Recupera tu acceso
        </h1>
        <p className="text-base text-muted-foreground">
          Ingresa tu email y te enviaremos un enlace para restablecer tu
          contraseña.
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
            name="email"
            render={({ field }) => (
              <FormItem className="auth-enter auth-enter-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="tu@email.com"
                    autoFocus
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
            className="press-feedback w-full auth-enter auth-enter-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Enviando…
              </>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground auth-enter auth-enter-3">
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
