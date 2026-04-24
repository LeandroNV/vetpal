"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  CATEGORIAS,
  CATEGORIA_LABEL,
  esCategoriaServicio,
  type CategoriaServicio,
} from "@/lib/domain/servicios";
import {
  cn,
  formatearDuracion,
  formatearFechaHora,
  formatearPrecioCOP,
} from "@/lib/utils";
import { citaSchema, type CitaInput } from "@/lib/validators/cita.schema";

export interface CaninoOption {
  id: string;
  nombre: string;
  raza: string | null;
}

export interface ServicioOption {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  duracion_minutos: number;
}

interface CitaFormProps {
  userId: string;
  caninos: ReadonlyArray<CaninoOption>;
  servicios: ReadonlyArray<ServicioOption>;
  servicioIdInicial: string | null;
}

/** Redondea al próximo múltiplo de 15 minutos >= ahora + 1h 5min. */
function minFechaHora(): Date {
  const d = new Date(Date.now() + 60 * 60 * 1000 + 5 * 60 * 1000);
  const m = d.getMinutes();
  const add = (15 - (m % 15)) % 15;
  d.setMinutes(m + add, 0, 0);
  return d;
}

export function CitaForm({
  userId,
  caninos,
  servicios,
  servicioIdInicial,
}: CitaFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const minFecha = useMemo(minFechaHora, []);

  const servicioInicialValido = useMemo(() => {
    if (!servicioIdInicial) return "";
    return servicios.some((s) => s.id === servicioIdInicial)
      ? servicioIdInicial
      : "";
  }, [servicioIdInicial, servicios]);

  const form = useForm<CitaInput>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      canino_id: caninos.length === 1 ? caninos[0].id : "",
      servicio_id: servicioInicialValido,
      fecha_hora: "",
      observaciones: "",
    },
    mode: "onBlur",
  });

  const rootError = form.formState.errors.root?.message;
  const isSubmitting = form.formState.isSubmitting;
  const values = form.watch();

  const serviciosPorCategoria = useMemo(() => {
    const map: Partial<Record<CategoriaServicio, ServicioOption[]>> = {};
    for (const s of servicios) {
      if (!esCategoriaServicio(s.categoria)) continue;
      (map[s.categoria] ??= []).push(s);
    }
    return map;
  }, [servicios]);

  const caninoSeleccionado = caninos.find((c) => c.id === values.canino_id);
  const servicioSeleccionado = servicios.find(
    (s) => s.id === values.servicio_id
  );
  const categoriaLabelSel =
    servicioSeleccionado && esCategoriaServicio(servicioSeleccionado.categoria)
      ? CATEGORIA_LABEL[servicioSeleccionado.categoria]
      : null;

  async function handleContinuar() {
    const valido = await form.trigger([
      "canino_id",
      "servicio_id",
      "fecha_hora",
      "observaciones",
    ]);
    if (valido) setStep(2);
  }

  async function onSubmit(data: CitaInput) {
    if (step !== 2) {
      await handleContinuar();
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("citas").insert({
      usuario_id: userId,
      canino_id: data.canino_id,
      servicio_id: data.servicio_id,
      fecha_hora: new Date(data.fecha_hora).toISOString(),
      estado: "pendiente",
      observaciones:
        data.observaciones.trim().length > 0
          ? data.observaciones.trim()
          : null,
    });

    if (error) {
      form.setError("root", {
        message:
          error.message ?? "No pudimos agendar la cita. Intenta de nuevo.",
      });
      setStep(1);
      return;
    }

    toast.success("Cita agendada", {
      description: servicioSeleccionado
        ? `${servicioSeleccionado.nombre} para ${caninoSeleccionado?.nombre ?? "tu peludo"}.`
        : "Tu cita fue registrada con éxito.",
    });
    router.push("/dashboard/citas");
    router.refresh();
  }

  const observacionesLen = values.observaciones.length;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        noValidate
      >
        <StepIndicator step={step} />

        {rootError ? (
          <Alert variant="destructive" role="alert">
            <AlertCircle className="size-4" aria-hidden="true" />
            <AlertDescription>{rootError}</AlertDescription>
          </Alert>
        ) : null}

        {step === 1 ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-semibold">
                Detalles de la cita
              </CardTitle>
              <CardDescription>
                Elige el peludo, el servicio y el momento que mejor te convenga.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <FormField
                control={form.control}
                name="canino_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Canino <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un canino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {caninos.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nombre}
                            <span className="text-xs text-muted-foreground">
                              · {c.raza ?? "Mestizo"}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servicio_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Servicio <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un servicio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIAS.map((cat) => {
                          const lista = serviciosPorCategoria[cat];
                          if (!lista || lista.length === 0) return null;
                          return (
                            <SelectGroup key={cat}>
                              <SelectLabel>{CATEGORIA_LABEL[cat]}</SelectLabel>
                              {lista.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  <span className="flex w-full items-center justify-between gap-3">
                                    <span>{s.nombre}</span>
                                    <span className="text-xs tabular-nums text-muted-foreground">
                                      {formatearPrecioCOP(s.precio)} ·{" "}
                                      {formatearDuracion(s.duracion_minutos)}
                                    </span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fecha_hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Fecha y hora <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(d) =>
                          field.onChange(d ? d.toISOString() : "")
                        }
                        min={minFecha}
                        locale={es}
                        placeholder="Selecciona fecha y hora"
                        use12HourFormat
                        clearable
                      />
                    </FormControl>
                    <FormDescription>
                      Debe ser al menos 1 hora en el futuro.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-2">
                      <FormLabel>Observaciones</FormLabel>
                      <span
                        className={cn(
                          "text-xs tabular-nums",
                          observacionesLen > 500
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                        aria-live="polite"
                      >
                        {observacionesLen}/500
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={3}
                        maxLength={500}
                        placeholder="¿Algo que el equipo deba saber? (opcional)"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-semibold">
                Confirma los detalles
              </CardTitle>
              <CardDescription>
                Revisa antes de confirmar. Podrás cancelarla después si lo
                necesitas.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <SummaryRow label="Canino">
                <div className="flex items-center gap-3">
                  <div
                    className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary"
                    aria-hidden="true"
                  >
                    <span className="font-display text-sm font-semibold">
                      {caninoSeleccionado?.nombre.charAt(0).toUpperCase() ?? "?"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {caninoSeleccionado?.nombre ?? "—"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {caninoSeleccionado?.raza ?? "Mestizo"}
                    </span>
                  </div>
                </div>
              </SummaryRow>

              <SummaryRow label="Servicio">
                {servicioSeleccionado ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">
                        {servicioSeleccionado.nombre}
                      </span>
                      {categoriaLabelSel ? (
                        <Badge variant="secondary" className="w-fit">
                          {categoriaLabelSel}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 text-sm tabular-nums text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {formatearPrecioCOP(servicioSeleccionado.precio)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {formatearDuracion(
                          servicioSeleccionado.duracion_minutos
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </SummaryRow>

              <SummaryRow label="Fecha y hora">
                <span className="font-medium text-foreground">
                  {values.fecha_hora
                    ? formatearFechaHora(values.fecha_hora)
                    : "—"}
                </span>
              </SummaryRow>

              {values.observaciones.trim().length > 0 ? (
                <SummaryRow label="Observaciones">
                  <p className="rounded-md bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
                    {values.observaciones.trim()}
                  </p>
                </SummaryRow>
              ) : null}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {step === 1 ? (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => router.push("/dashboard/citas")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver a editar
            </Button>
          )}

          {step === 1 ? (
            <Button
              type="button"
              size="lg"
              className="press-feedback"
              onClick={handleContinuar}
            >
              Continuar
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              className="press-feedback"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Agendando...
                </>
              ) : (
                <>
                  <CalendarCheck className="size-4" aria-hidden="true" />
                  Confirmar cita
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  const pasos = [
    { n: 1, label: "Selección" },
    { n: 2, label: "Confirmación" },
  ];
  return (
    <ol className="flex items-center gap-3 text-sm" aria-label="Progreso">
      {pasos.map((p, i) => {
        const activo = step === p.n;
        const completado = step > p.n;
        return (
          <li key={p.n} className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors",
                activo && "bg-primary/10 text-primary",
                completado && "text-success",
                !activo && !completado && "text-muted-foreground"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-5 place-items-center rounded-full text-xs font-semibold",
                  activo
                    ? "bg-primary text-primary-foreground"
                    : completado
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {p.n}
              </span>
              <span className="font-medium">{p.label}</span>
            </div>
            {i < pasos.length - 1 ? (
              <span
                aria-hidden="true"
                className="h-px w-8 bg-border sm:w-16"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border pb-4 last:border-0 last:pb-0">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}
