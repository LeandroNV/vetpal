import type { Metadata } from "next";
import Link from "next/link";

import { VetpalLogo } from "@/components/landing/vetpal-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo VETPAL recolecta, usa y protege los datos de usuarios y caninos.",
};

const UPDATED_AT = "23 de abril de 2026";

export default function PrivacidadPage() {
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
            Política de privacidad
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: {UPDATED_AT}
          </p>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>1. Qué datos recopilamos</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Recopilamos datos de cuenta (nombre, correo), información de uso de la plataforma y datos clínicos de mascotas
              que el usuario decida registrar para gestión de citas e historial.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Para qué usamos la información</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Usamos la información para habilitar autenticación, agendamiento, historial clínico, mejoras de servicio,
              soporte y comunicaciones operativas relacionadas con VETPAL.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Seguridad y conservación</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Aplicamos controles técnicos y organizativos razonables para proteger los datos. Conservamos la información
              mientras sea necesaria para prestar el servicio, cumplir obligaciones legales o resolver disputas.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Tus derechos</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Puedes solicitar acceso, actualización o eliminación de tus datos, y gestionar tu cuenta cuando corresponda.
              Para ejercer derechos o resolver dudas, escríbenos a{" "}
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
