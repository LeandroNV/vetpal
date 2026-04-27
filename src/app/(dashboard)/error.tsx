"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-8 py-20">
      <Card className="w-full items-center gap-6 px-6 py-14 text-center">
        <div
          className="grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive"
          aria-hidden="true"
        >
          <AlertTriangle className="size-7" strokeWidth={1.75} />
        </div>
        <div className="flex max-w-md flex-col gap-2">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Algo salió mal
          </h2>
          <p className="text-sm text-muted-foreground">
            Ocurrió un error inesperado al cargar esta sección. Puedes intentar
            de nuevo o volver al inicio.
          </p>
          {error.digest ? (
            <p className="mt-1 font-mono text-xs text-muted-foreground/60">
              Ref: {error.digest}
            </p>
          ) : null}
        </div>
        <CardContent className="flex flex-wrap justify-center gap-3 pt-0">
          <Button onClick={reset} className="press-feedback">
            <RefreshCw className="size-4" strokeWidth={2} />
            Intentar de nuevo
          </Button>
          <Button variant="outline" asChild>
            <a href="/dashboard">Ir al inicio</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
