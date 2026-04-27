"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, CheckCheck, ClipboardPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  confirmarCita,
  completarCita,
} from "@/app/(dashboard)/dashboard/citas/actions";

interface AccionesVeterinarioProps {
  citaId: string;
  caninoId: string;
  estado: string;
  servicioNombre?: string;
}

export function AccionesVeterinario({
  citaId,
  caninoId,
  estado,
  servicioNombre,
}: AccionesVeterinarioProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openCompletar, setOpenCompletar] = useState(false);

  // Optimistic: muestra el siguiente estado inmediatamente
  const [optimisticEstado, setOptimisticEstado] = useOptimistic(estado);

  if (optimisticEstado === "pendiente") {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        className="press-feedback text-success hover:bg-success/10 hover:text-success"
        onClick={() => {
          startTransition(async () => {
            setOptimisticEstado("confirmada");
            const result = await confirmarCita({ citaId });
            if (result.ok) {
              toast.success("Cita confirmada", {
                description: servicioNombre
                  ? `Se confirmó "${servicioNombre}".`
                  : "La cita fue confirmada.",
              });
              router.refresh();
            } else {
              toast.error("No se pudo confirmar", {
                description: result.error,
              });
            }
          });
        }}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Check className="size-4" strokeWidth={2} aria-hidden="true" />
        )}
        {isPending ? "Confirmando..." : "Confirmar"}
      </Button>
    );
  }

  if (optimisticEstado === "confirmada") {
    return (
      <AlertDialog
        open={openCompletar}
        onOpenChange={(v) => !isPending && setOpenCompletar(v)}
      >
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="press-feedback text-primary hover:bg-primary/10 hover:text-primary"
          >
            <CheckCheck className="size-4" strokeWidth={2} aria-hidden="true" />
            Completada
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Marcar como completada?</AlertDialogTitle>
            <AlertDialogDescription>
              {servicioNombre
                ? `Se marcará "${servicioNombre}" como completada. `
                : "Se marcará esta cita como completada. "}
              Podrás registrar el historial clínico después.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                startTransition(async () => {
                  setOptimisticEstado("completada");
                  const result = await completarCita({ citaId });
                  if (result.ok) {
                    toast.success("Cita completada", {
                      description: "Puedes registrar la consulta ahora.",
                    });
                    setOpenCompletar(false);
                    router.refresh();
                  } else {
                    toast.error("No se pudo completar", {
                      description: result.error,
                    });
                  }
                });
              }}
            >
              {isPending ? (
                <>
                  <Loader2
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Procesando...
                </>
              ) : (
                "Sí, completar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (optimisticEstado === "completada") {
    return (
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="press-feedback text-primary hover:text-primary"
      >
        <Link
          href={`/dashboard/historial/nueva?cita=${citaId}&canino=${caninoId}`}
        >
          <ClipboardPlus className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Registrar consulta
        </Link>
      </Button>
    );
  }

  return null;
}
