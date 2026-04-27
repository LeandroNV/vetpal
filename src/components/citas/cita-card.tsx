import { CalendarClock, PawPrint, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CancelarCitaButton } from "@/components/citas/cancelar-cita-button";
import { AccionesVeterinario } from "@/components/citas/acciones-veterinario";
import { ESTADO_BADGE, esCancelable, esEstadoCita } from "@/lib/domain/citas";
import { HoverCardWrapper } from "@/components/ui/hover-card-wrapper";
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
    raza: string | null;
  } | null;
  propietario_nombre?: string | null;
}

export function CitaCard({
  cita,
  rol = "propietario",
}: {
  cita: CitaCardData;
  rol?: "propietario" | "veterinario" | "administrador";
}) {
  const estadoKey = esEstadoCita(cita.estado) ? cita.estado : null;
  const estadoCfg = estadoKey ? ESTADO_BADGE[estadoKey] : null;
  const servicio = cita.servicio;
  const canino = cita.canino;
  const esVet = rol === "veterinario" || rol === "administrador";

  const categoriaLabel =
    servicio && esCategoriaServicio(servicio.categoria)
      ? CATEGORIA_LABEL[servicio.categoria]
      : null;

  const mostrarCancelar =
    !esVet && esCancelable(cita.estado, cita.fecha_hora);

  // Identidad del canino: nombre + raza
  const caninoIdentidad = canino
    ? `${canino.nombre} (${canino.raza?.trim() || "Mestizo"})`
    : "—";

  return (
    <HoverCardWrapper>
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
            <div className="flex flex-wrap items-center gap-2">
              {cita.estado === "confirmada" &&
              (() => {
                const diffMinutos =
                  (new Date(cita.fecha_hora).getTime() - Date.now()) / 60000;
                return diffMinutos > 0 && diffMinutos <= 30;
              })() ? (
                <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex size-1.5 rounded-full bg-destructive"></span>
                  </span>
                  En breve
                </span>
              ) : null}
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium",
                  estadoCfg.className
                )}
              >
                {estadoCfg.label}
              </span>
            </div>
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
            <dd className="text-foreground">{caninoIdentidad}</dd>
          </div>

          {esVet && cita.propietario_nombre ? (
            <div className="flex items-center gap-1.5">
              <User
                className="size-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <dt className="sr-only">Propietario</dt>
              <dd>{cita.propietario_nombre}</dd>
            </div>
          ) : null}

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

      {(mostrarCancelar || esVet) && servicio && canino ? (
        <CardFooter className="justify-end gap-2 pt-0">
          {mostrarCancelar ? (
            <CancelarCitaButton
              citaId={cita.id}
              nombreServicio={servicio.nombre}
              nombreCanino={canino.nombre}
            />
          ) : null}
          {esVet ? (
            <AccionesVeterinario
              citaId={cita.id}
              caninoId={canino.id}
              estado={cita.estado}
              servicioNombre={servicio.nombre}
            />
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
    </HoverCardWrapper>
  );
}
