"use client";

import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CaninoSelectOption = {
  id: string;
  nombre: string;
  raza: string | null;
};

type Props = {
  caninos: ReadonlyArray<CaninoSelectOption>;
  value: string | null;
  /** Si true, primera opción es "Todos" (sin filtro). */
  allowTodos?: boolean;
  label?: string;
};

export function HistorialCaninoSelect({
  caninos,
  value,
  allowTodos = false,
  label = "Canino",
}: Props) {
  const router = useRouter();

  const inList = value && caninos.some((c) => c.id === value);
  const selectValue = inList
    ? value
    : allowTodos
      ? "__todos__"
      : undefined;

  return (
    <div className="flex max-w-md flex-col gap-2">
      {label ? (
        <Label htmlFor="historial-canino" className="text-foreground">
          {label}
        </Label>
      ) : null}
      <Select
        value={selectValue}
        onValueChange={(v) => {
          if (v === "__todos__") {
            router.push("/dashboard/historial");
            return;
          }
          router.push(`/dashboard/historial?canino=${v}`);
        }}
      >
        <SelectTrigger
          id="historial-canino"
          className="w-full bg-background"
          size="default"
        >
          <SelectValue
            placeholder={
              allowTodos ? "Todos los caninos" : "Selecciona un canino"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {allowTodos ? (
            <SelectItem value="__todos__">Todos los caninos</SelectItem>
          ) : null}
          {caninos.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.nombre}
              {c.raza ? ` · ${c.raza}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
