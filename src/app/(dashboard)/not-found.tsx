import Link from "next/link";
import { Home, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-8 py-20">
      <Card className="w-full items-center gap-6 px-6 py-14 text-center">
        <div
          className="grid size-16 place-items-center rounded-2xl bg-muted text-muted-foreground"
          aria-hidden="true"
        >
          <SearchX className="size-7" strokeWidth={1.75} />
        </div>
        <div className="flex max-w-md flex-col gap-2">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Página no encontrada
          </h2>
          <p className="text-sm text-muted-foreground">
            La página que buscas no existe o fue movida. Verifica la URL o
            vuelve al panel principal.
          </p>
        </div>
        <Button asChild className="press-feedback">
          <Link href="/dashboard">
            <Home className="size-4" strokeWidth={2} />
            Ir al inicio
          </Link>
        </Button>
      </Card>
    </div>
  );
}
