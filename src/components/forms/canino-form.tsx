"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";
import { caninoSchema, type CaninoInput } from "@/lib/validators/canino.schema";

type Canino = Tables<"caninos">;

type CreateProps = {
  mode: "create";
  userId: string;
  initialValues?: undefined;
  caninoId?: undefined;
};

type EditProps = {
  mode: "edit";
  userId: string;
  caninoId: string;
  initialValues: Canino;
};

type Props = CreateProps | EditProps;

const hoyISO = () => new Date().toISOString().split("T")[0];

function toFormValues(canino?: Canino): CaninoInput {
  return {
    nombre: canino?.nombre ?? "",
    raza: canino?.raza ?? "",
    sexo: (canino?.sexo as "M" | "F") ?? "M",
    fecha_nacimiento: canino?.fecha_nacimiento ?? "",
    peso_kg:
      canino?.peso_kg != null && !Number.isNaN(Number(canino.peso_kg))
        ? String(canino.peso_kg)
        : "",
  };
}

export function CaninoForm(props: Props) {
  const router = useRouter();
  const isEdit = props.mode === "edit";

  const form = useForm<CaninoInput>({
    resolver: zodResolver(caninoSchema),
    defaultValues: toFormValues(
      props.mode === "edit" ? props.initialValues : undefined
    ),
    mode: "onBlur",
  });

  const rootError = form.formState.errors.root?.message;
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: CaninoInput) {
    const supabase = createClient();

    const payload = {
      nombre: values.nombre.trim(),
      raza: values.raza.trim() === "" ? null : values.raza.trim(),
      sexo: values.sexo,
      fecha_nacimiento:
        values.fecha_nacimiento === "" ? null : values.fecha_nacimiento,
      peso_kg: values.peso_kg === "" ? null : Number(values.peso_kg),
    };

    if (props.mode === "create") {
      const { error } = await supabase.from("caninos").insert({
        ...payload,
        propietario_id: props.userId,
      });

      if (error) {
        form.setError("root", {
          message:
            error.message ??
            "No pudimos registrar el canino. Intenta de nuevo.",
        });
        return;
      }

      toast.success("Canino registrado", {
        description: `${payload.nombre} ya forma parte de tu familia.`,
      });
      router.push("/dashboard/caninos");
      router.refresh();
      return;
    }

    const { error } = await supabase
      .from("caninos")
      .update(payload)
      .eq("id", props.caninoId);

    if (error) {
      form.setError("root", {
        message:
          error.message ?? "No pudimos guardar los cambios. Intenta de nuevo.",
      });
      return;
    }

    toast.success("Cambios guardados", {
      description: `La información de ${payload.nombre} fue actualizada.`,
    });
    router.push("/dashboard/caninos");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        {rootError ? (
          <Alert variant="destructive" role="alert">
            <AlertCircle className="size-4" aria-hidden="true" />
            <AlertDescription>{rootError}</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-semibold">
              Información básica
            </CardTitle>
            <CardDescription>
              Los datos clínicos y de identificación de tu peludo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>
                    Nombre <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Ej: Luna, Max, Rocky…"
                      maxLength={100}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="raza"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Raza</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Mestizo, Labrador, Border Collie…"
                      maxLength={100}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Sexo <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el sexo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M">Macho</SelectItem>
                      <SelectItem value="F">Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha_nacimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de nacimiento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      max={hoyISO()}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="peso_kg"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel>Peso</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0.01"
                        max="200"
                        placeholder="0.0"
                        className="pr-12"
                        {...field}
                      />
                      <span
                        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-muted-foreground"
                        aria-hidden="true"
                      >
                        kg
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => router.push("/dashboard/caninos")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="lg"
            className="press-feedback"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {isEdit ? "Guardando…" : "Registrando…"}
              </>
            ) : isEdit ? (
              "Guardar cambios"
            ) : (
              "Registrar canino"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
