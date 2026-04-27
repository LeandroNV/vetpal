"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command as CommandIcon, Search, SearchIcon } from "lucide-react";
import { DialogProps } from "@radix-ui/react-dialog";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { createClient } from "@/lib/supabase/client";

type Propietario = { id: string; nombre_completo: string; email: string };
type Canino = { id: string; nombre: string; raza: string | null };
type OwnerWithPets = { owner: Propietario; pets: Canino[] };

export function VetCommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [owners, setOwners] = React.useState<OwnerWithPets[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeOwner, setActiveOwner] = React.useState<OwnerWithPets | null>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch all propietarios when dialog opens
  React.useEffect(() => {
    if (open && owners.length === 0) {
      const fetchOwnersAndPets = async () => {
        setIsLoading(true);
        const supabase = createClient();
        
        // Query usuarios directly to include those who might not have pets yet
        const { data } = await supabase
          .from("usuarios")
          .select("id, nombre_completo, email, caninos(id, nombre, raza)")
          .eq("rol", "propietario");
        
        if (data) {
          const formattedOwners: OwnerWithPets[] = data.map((user: any) => ({
            owner: {
              id: user.id,
              nombre_completo: user.nombre_completo,
              email: user.email,
            },
            pets: user.caninos || [],
          }));
          setOwners(formattedOwners);
        }
        setIsLoading(false);
      };
      fetchOwnersAndPets();
    }
  }, [open, owners.length]);

  // Reset active owner when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => setActiveOwner(null), 200);
    }
  }, [open]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-2 rounded-full bg-surface-muted/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-muted/80 hover:text-foreground md:max-w-xs"
      >
        <SearchIcon className="size-4 opacity-50" />
        <span className="flex-1 text-left">Buscar paciente...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} {...props}>
        <CommandInput 
          placeholder={activeOwner ? `Buscar mascota de ${activeOwner.owner.nombre_completo}...` : "Buscar por correo electrónico o nombre de cliente..."} 
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? "Buscando..." : "No se encontraron resultados."}
          </CommandEmpty>
          
          {!activeOwner && (
            <CommandGroup heading="Propietarios">
              {owners.map((item) => (
                <CommandItem
                  key={item.owner.id}
                  value={`${item.owner.email} ${item.owner.nombre_completo}`}
                  onSelect={() => setActiveOwner(item)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{item.owner.nombre_completo}</span>
                    <span className="text-xs text-muted-foreground">{item.owner.email}</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {item.pets.length} {item.pets.length === 1 ? "mascota" : "mascotas"}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {activeOwner && (
            <>
              <CommandItem
                value="volver atrás regresar propietarios"
                onSelect={() => setActiveOwner(null)}
                className="mb-2 text-muted-foreground cursor-pointer"
              >
                ← Volver a todos los propietarios
              </CommandItem>
              
              <CommandGroup heading={`Mascotas de ${activeOwner.owner.nombre_completo}`}>
                {activeOwner.pets.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Este cliente no tiene mascotas registradas.</p>
                ) : (
                  activeOwner.pets.map((pet) => (
                    <CommandItem
                      key={pet.id}
                      value={pet.nombre}
                      onSelect={() => {
                        runCommand(() => router.push(`/dashboard/historial?canino=${pet.id}`));
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {pet.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span>{pet.nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          {pet.raza || "Mestizo"}
                        </span>
                      </div>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
