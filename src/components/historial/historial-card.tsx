import Link from "next/link";
import { Pencil, Stethoscope } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatearFecha } from "@/lib/utils";

export type HistorialCardData = {
  id: string;
  created_at: string;
  motivo_consulta: string;
  diagnostico: string | null;
  tratamiento: string | null;
  medicamentos: string | null;
  proxima_cita: string | null;
  servicio_nombre: string | null;
  veterinario_nombre: string;
};

type Props = {
  item: HistorialCardData;
  mostrarEditar: boolean;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

export function HistorialCard({ item, mostrarEditar }: Props) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-3 pb-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <time
                className="font-medium text-foreground"
                dateTime={item.created_at}
              >
                {formatearFecha(item.created_at)}
              </time>
              <Badge variant="secondary" className="font-normal">
                <Stethoscope className="size-3" strokeWidth={1.75} />
                Consulta
              </Badge>
            </div>
            {item.servicio_nombre ? (
              <p className="text-sm text-muted-foreground">
                Servicio: {item.servicio_nombre}
              </p>
            ) : null}
          </div>
          {mostrarEditar ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/historial/${item.id}/editar`}>
                <Pencil className="size-3.5" strokeWidth={1.75} />
                Editar
              </Link>
            </Button>
          ) : null}
        </div>
        <p className="font-semibold text-foreground">{item.motivo_consulta}</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <Section title="Diagnóstico">
          {item.diagnostico?.trim() ? item.diagnostico : null}
        </Section>
        <Section title="Tratamiento">
          {item.tratamiento?.trim() ? item.tratamiento : null}
        </Section>
        <Section title="Medicamentos">
          {item.medicamentos?.trim() ? item.medicamentos : null}
        </Section>
        {item.proxima_cita ? (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Próxima cita
            </p>
            <p className="text-sm text-foreground">
              {formatearFecha(item.proxima_cita)}
            </p>
          </div>
        ) : null}
        {!item.diagnostico?.trim() &&
        !item.tratamiento?.trim() &&
        !item.medicamentos?.trim() &&
        !item.proxima_cita ? (
          <p className="text-sm text-muted-foreground">
            Sin detalles clínicos adicionales.
          </p>
        ) : null}
      </CardContent>
      <Separator />
      <CardFooter className="text-sm text-muted-foreground">
        Atendido por:{" "}
        <span className="font-medium text-foreground">
          {item.veterinario_nombre}
        </span>
      </CardFooter>
    </Card>
  );
}
