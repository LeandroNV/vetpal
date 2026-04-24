"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Menu, PawPrint } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#testimonios", label: "Testimonios" },
] as const;

export default function Navbar() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 16);
  });

  return (
    <motion.nav
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border/50 bg-background/80 shadow-sm backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-90"
        >
          <PawPrint className="size-7 text-accent" strokeWidth={1.75} aria-hidden />
          <span className="font-heading text-xl font-extrabold tracking-tight">VETPAL</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/90 transition-all duration-300 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login" className="text-sm">
              Iniciar sesión
            </Link>
          </Button>
          <Button size="sm" className="rounded-full px-5 text-sm" asChild>
            <Link href="/register">Comenzar gratis</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button size="sm" className="rounded-full px-4 text-sm" asChild>
            <Link href="/register">Comenzar</Link>
          </Button>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                aria-label="Abrir menú de navegación"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="text-left">Menú</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-1" aria-label="Principal">
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setSheetOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-muted"
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  href="/login"
                  onClick={() => setSheetOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-muted"
                >
                  Iniciar sesión
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
