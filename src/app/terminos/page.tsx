import type { Metadata } from "next";
import Link from "next/link";

import { VetpalLogo } from "@/components/landing/vetpal-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de uso de la plataforma VETPAL.",
};

const UPDATED_AT = "23 de abril de 2026";

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/80 bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Volver al inicio de VETPAL">
            <VetpalLogo iconSize="sm" compact />
          </Link>
          <Button asChild variant="ghost">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Términos y condiciones
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: {UPDATED_AT}
          </p>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>1. Uso de la plataforma</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              VETPAL ofrece herramientas digitales para gestión de citas y seguimiento canino. El usuario debe usar la
              plataforma de forma lícita y con información veraz.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Responsabilidades del usuario</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              El usuario es responsable de mantener la confidencialidad de su cuenta, resguardar credenciales y reportar
              uso no autorizado cuando lo detecte.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Disponibilidad y cambios</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Podemos actualizar funcionalidades, políticas o condiciones para mejorar el servicio y cumplir requisitos
              técnicos o regulatorios. Los cambios relevantes se comunicarán oportunamente.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Contacto y soporte</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Para consultas sobre estos términos, escríbenos a{" "}
              <a className="text-primary underline-offset-4 hover:underline" href="mailto:contacto@vetpal.edu.co">
                contacto@vetpal.edu.co
              </a>
              .
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
