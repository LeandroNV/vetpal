"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  PawPrint,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/database.types";

type Rol = Database["public"]["Enums"]["rol_usuario"];

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Roles que ven este item. Undefined = todos. */
  roles?: ReadonlyArray<Rol>;
};

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  {
    href: "/dashboard/caninos",
    label: "Mis Caninos",
    icon: PawPrint,
    roles: ["propietario"],
  },
  { href: "/dashboard/citas", label: "Citas", icon: CalendarDays },
  { href: "/dashboard/historial", label: "Historial", icon: ClipboardList },
  { href: "/dashboard/servicios", label: "Catálogo", icon: Stethoscope },
];

function filterByRole(items: ReadonlyArray<NavItem>, rol: Rol): NavItem[] {
  return items.filter((item) => !item.roles || item.roles.includes(rol));
}

export function NavList({
  rol = "propietario",
  onNavigate,
  className,
}: {
  rol?: Rol;
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const visibleItems = filterByRole(NAV_ITEMS, rol);

  return (
    <nav aria-label="Navegación principal" className={cn("px-3", className)}>
      <ul className="flex flex-col gap-0.5">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "duration-(--duration-fast) ease-(--ease-out-strong)",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  strokeWidth={1.75}
                />
                <span className="truncate">{item.label}</span>
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
