"use client";

import { useState, useTransition } from "react";
import { Loader2, XIcon } from "lucide-react";
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
import { cancelarCita } from "@/app/(dashboard)/dashboard/citas/actions";

interface CancelarCitaButtonProps {
  citaId: string;
  nombreServicio: string;
  nombreCanino: string;
}

export function CancelarCitaButton({
  citaId,
  nombreServicio,
  nombreCanino,
}: CancelarCitaButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await cancelarCita({ citaId });
      if (result.ok) {
        toast.success("Cita cancelada", {
          description: `Se canceló "${nombreServicio}" para ${nombreCanino}.`,
        });
        setOpen(false);
      } else {
        toast.error("No se pudo cancelar", { description: result.error });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !isPending && setOpen(v)}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="press-feedback text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <XIcon className="size-4" strokeWidth={2} aria-hidden="true" />
          Cancelar cita
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cancelar esta cita?</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a cancelar <strong>{nombreServicio}</strong> para{" "}
            <strong>{nombreCanino}</strong>. Esta acción no se puede deshacer,
            pero puedes agendar una nueva cita cuando quieras.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Mantener</AlertDialogCancel>
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
                Cancelando...
              </>
            ) : (
              "Sí, cancelar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
