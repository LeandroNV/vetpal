"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
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
import { eliminarCanino } from "@/app/(dashboard)/dashboard/caninos/actions";

interface EliminarCaninoButtonProps {
  caninoId: string;
  nombre: string;
}

export function EliminarCaninoButton({
  caninoId,
  nombre,
}: EliminarCaninoButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await eliminarCanino({ caninoId });
      if (result.ok) {
        toast.success("Canino eliminado", {
          description: `Se eliminó a "${nombre}" correctamente.`,
        });
        setOpen(false);
        router.refresh();
      } else {
        toast.error("No se pudo eliminar", { description: result.error });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !isPending && setOpen(v)}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="press-feedback flex-1 justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar a {nombre}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminarán todos los registros
            asociados a <strong>{nombre}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Eliminando...
              </>
            ) : (
              "Sí, eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
