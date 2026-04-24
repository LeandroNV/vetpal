import { CalendarClock, PawPrint } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CancelarCitaButton } from "@/components/citas/cancelar-cita-button";
import { ESTADO_BADGE, esCancelable, esEstadoCita } from "@/lib/domain/citas";
import {
  CATEGORIA_LABEL,
  esCategoriaServicio,
} from "@/lib/domain/servicios";
import {
  cn,
  formatearDuracion,
  formatearFechaHora,
  formatearPrecioCOP,
} from "@/lib/utils";

export interface CitaCardData {
  id: string;
  fecha_hora: string;
  estado: string;
  observaciones: string | null;
  servicio: {
    id: string;
    nombre: string;
    categoria: string;
    precio: number;
    duracion_minutos: number;
  } | null;
  canino: {
    id: string;
    nombre: string;
  } | null;
}

export function CitaCard({ cita }: { cita: CitaCardData }) {
  const estadoKey = esEstadoCita(cita.estado) ? cita.estado : null;
  const estadoCfg = estadoKey ? ESTADO_BADGE[estadoKey] : null;
  const servicio = cita.servicio;
  const canino = cita.canino;

  const categoriaLabel =
    servicio && esCategoriaServicio(servicio.categoria)
      ? CATEGORIA_LABEL[servicio.categoria]
      : null;

  const mostrarCancelar = esCancelable(cita.estado, cita.fecha_hora);

  return (
    <Card className="gap-4">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="font-display text-lg font-semibold leading-snug">
              {servicio?.nombre ?? "Servicio eliminado"}
            </CardTitle>
            {categoriaLabel ? (
              <Badge variant="secondary" className="w-fit">
                {categoriaLabel}
              </Badge>
            ) : null}
          </div>
          {estadoCfg ? (
            <span
              className={cn(
                "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium",
                estadoCfg.className
              )}
            >
              {estadoCfg.label}
            </span>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <dl className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
          <div className="flex items-center gap-1.5">
            <PawPrint
              className="size-4 text-primary"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <dt className="sr-only">Canino</dt>
            <dd className="text-foreground">{canino?.nombre ?? "—"}</dd>
          </div>

          <div className="flex items-center gap-1.5">
            <CalendarClock
              className="size-4"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <dt className="sr-only">Fecha y hora</dt>
            <dd>{formatearFechaHora(cita.fecha_hora)}</dd>
          </div>

          {servicio ? (
            <div className="flex items-center gap-1.5 tabular-nums">
              <dt className="sr-only">Precio</dt>
              <dd className="font-medium text-foreground">
                {formatearPrecioCOP(servicio.precio)}
              </dd>
              <span aria-hidden="true">·</span>
              <dd>{formatearDuracion(servicio.duracion_minutos)}</dd>
            </div>
          ) : null}
        </dl>

        {cita.observaciones ? (
          <p className="rounded-md bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Observaciones: </span>
            {cita.observaciones}
          </p>
        ) : null}
      </CardContent>

      {mostrarCancelar && servicio && canino ? (
        <CardFooter className="justify-end pt-0">
          <CancelarCitaButton
            citaId={cita.id}
            nombreServicio={servicio.nombre}
            nombreCanino={canino.nombre}
          />
        </CardFooter>
      ) : null}
    </Card>
  );
}
