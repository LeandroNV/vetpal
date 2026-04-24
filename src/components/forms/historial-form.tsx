"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MOTIVOS_COMUNES } from "@/lib/domain/historial";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";
import { formatearFechaHora } from "@/lib/utils";
import { historialSchema, type HistorialInput } from "@/lib/validators/historial.schema";

type CaninoConPropietario = Pick<
  Tables<"caninos">,
  "id" | "nombre" | "raza" | "peso_kg" | "fecha_nacimiento" | "sexo"
> & {
  propietario: { nombre_completo: string } | null;
};

export type CitaHistorialOption = {
  id: string;
  fecha_hora: string;
  canino_id: string;
  canino: { nombre: string; raza: string | null } | null;
  servicio: { nombre: string } | null;
};

type Props =
  | {
      mode: "create";
      caninos: ReadonlyArray<CaninoConPropietario>;
      citas: ReadonlyArray<CitaHistorialOption>;
      veterinarioId: string;
    }
  | {
      mode: "edit";
      registro: Tables<"historiales_clinicos">;
      caninos: ReadonlyArray<CaninoConPropietario>;
      citas: ReadonlyArray<CitaHistorialOption>;
      veterinarioId: string;
    };

function initialMotivoPreset(
  registro: Tables<"historiales_clinicos"> | null
): (typeof MOTIVOS_COMUNES)[number] {
  if (!registro) return MOTIVOS_COMUNES[0]!;
  const m = registro.motivo_consulta;
  if ((MOTIVOS_COMUNES as readonly string[]).includes(m) && m !== "Otro") {
    return m as (typeof MOTIVOS_COMUNES)[number];
  }
  return "Otro";
}

export function HistorialForm(props: Props) {
  const { mode, caninos, citas, veterinarioId } = props;
  const registro = props.mode === "edit" ? props.registro : null;
  const router = useRouter();
  const [motivoPreset, setMotivoPreset] = useState<
    (typeof MOTIVOS_COMUNES)[number]
  >(initialMotivoPreset(registro));

  const defaultValues: HistorialInput = useMemo(() => {
    if (!registro) {
      return {
        canino_id: caninos[0]?.id ?? "",
        cita_id: "",
        motivo_consulta: "Consulta de rutina",
        diagnostico: "",
        tratamiento: "",
        medicamentos: "",
        proxima_cita: "",
      };
    }
    const preset = initialMotivoPreset(registro);
    return {
      canino_id: registro.canino_id,
      cita_id: registro.cita_id ?? "",
      motivo_consulta:
        preset === "Otro" ? registro.motivo_consulta : preset,
      diagnostico: registro.diagnostico ?? "",
      tratamiento: registro.tratamiento ?? "",
      medicamentos: registro.medicamentos ?? "",
      proxima_cita: registro.proxima_cita
        ? registro.proxima_cita.slice(0, 10)
        : "",
    };
  }, [registro, caninos]);

  const form = useForm<HistorialInput>({
    resolver: zodResolver(historialSchema),
    defaultValues,
  });

  const caninoId = form.watch("canino_id");

  const citasDelCanino = useMemo(
    () => citas.filter((c) => c.canino_id === caninoId),
    [citas, caninoId]
  );

  async function onSubmit(values: HistorialInput) {
    const supabase = createClient();
    const motivoFinal =
      motivoPreset === "Otro" ? values.motivo_consulta : motivoPreset;
    if (motivoFinal.trim().length < 3) {
      toast.error("Describe el motivo (mínimo 3 caracteres).");
      return;
    }
    const citaId = values.cita_id?.trim() ? values.cita_id : null;
    const payload = {
      canino_id: values.canino_id,
      cita_id: citaId,
      motivo_consulta: motivoFinal,
      diagnostico: values.diagnostico?.trim() || null,
      tratamiento: values.tratamiento?.trim() || null,
      medicamentos: values.medicamentos?.trim() || null,
      proxima_cita: values.proxima_cita?.trim() || null,
    };

    if (mode === "create") {
      const { error } = await supabase.from("historiales_clinicos").insert({
        ...payload,
        veterinario_id: veterinarioId,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Consulta registrada");
      router.push(`/dashboard/historial?canino=${values.canino_id}`);
      return;
    }

    const { error: errUpd } = await supabase
      .from("historiales_clinicos")
      .update({
        canino_id: payload.canino_id,
        cita_id: payload.cita_id,
        motivo_consulta: payload.motivo_consulta,
        diagnostico: payload.diagnostico,
        tratamiento: payload.tratamiento,
        medicamentos: payload.medicamentos,
        proxima_cita: payload.proxima_cita,
      })
      .eq("id", registro!.id);
    if (errUpd) {
      toast.error(errUpd.message);
      return;
    }
    toast.success("Consulta actualizada");
    router.back();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-2xl flex-col gap-6"
      >
        <p>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={
                caninoId
                  ? `/dashboard/historial?canino=${caninoId}`
                  : "/dashboard/historial"
              }
            >
              <ArrowLeft className="size-4" />
              Volver al historial
            </Link>
          </Button>
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Información de la consulta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="canino_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canino</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("cita_id", "");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {caninos.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nombre} · {c.raza?.trim() || "Mestizo"} ·{" "}
                          {c.propietario?.nombre_completo ?? "—"}
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
              name="cita_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cita asociada (opcional)</FormLabel>
                  <Select
                    onValueChange={(v) =>
                      field.onChange(v === "__ninguna__" ? "" : v)
                    }
                    value={
                      field.value && String(field.value).length > 0
                        ? String(field.value)
                        : "__ninguna__"
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sin cita vinculada" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__ninguna__">Sin cita vinculada</SelectItem>
                      {citasDelCanino.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {formatearFechaHora(c.fecha_hora)} —{" "}
                          {c.servicio?.nombre ?? "Servicio"}{" "}
                          {c.canino?.nombre ? `· ${c.canino.nombre}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Solo se listan citas completadas aún sin historial, del canino
                    elegido.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Motivo de consulta</FormLabel>
              <Select
                value={motivoPreset}
                onValueChange={(v) => {
                  const next = v as (typeof MOTIVOS_COMUNES)[number];
                  setMotivoPreset(next);
                  if (next === "Otro") {
                    form.setValue("motivo_consulta", "");
                  } else {
                    form.setValue("motivo_consulta", next, {
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOTIVOS_COMUNES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {motivoPreset === "Otro" ? (
              <FormField
                control={form.control}
                name="motivo_consulta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe el motivo</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px] rounded-2xl"
                        maxLength={500}
                        placeholder="Escribe el motivo de la consulta…"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Hallazgos clínicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="diagnostico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnóstico (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px] rounded-2xl"
                      maxLength={1000}
                      placeholder="Diagnóstico"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tratamiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tratamiento (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px] rounded-2xl"
                      maxLength={1000}
                      placeholder="Tratamiento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Medicación y seguimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="medicamentos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicamentos (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[90px] rounded-2xl"
                      maxLength={1000}
                      placeholder="Amoxicilina 500mg — 1 comprimido cada 12h por 7 días"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proxima_cita"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próxima cita (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-2xl"
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="min-w-40"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === "create" ? (
              "Registrar consulta"
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
