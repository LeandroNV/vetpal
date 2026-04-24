"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("No se pudo cerrar sesión. Intenta de nuevo.");
        setLoading(false);
        return;
      }
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("No se pudo cerrar sesión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Cerrar sesión"
      className="shrink-0 text-muted-foreground hover:text-foreground"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
