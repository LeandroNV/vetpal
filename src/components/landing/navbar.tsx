"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Menu } from "lucide-react";

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
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <Image src="/images/landing/logo.svg" alt="VETPAL Logo" width={140} height={32} className="h-8 w-auto" />
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
            <SheetContent side="right" className="w-full sm:max-w-md bg-[#FDFBF7] border-l-0 p-8 flex flex-col">
              <SheetHeader className="text-left mb-12">
                <SheetTitle className="flex items-center gap-2">
                  <Image src="/images/landing/logo.svg" alt="VETPAL Logo" width={140} height={32} className="h-8 w-auto" />
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-6 flex-1" aria-label="Principal">
                {NAV_LINKS.map((item, i) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setSheetOpen(false)}
                    className="group flex items-center justify-between border-b border-[#1A2E25]/10 pb-4 text-3xl font-serif text-[#1A2E25] transition-all hover:text-[#C46A42]"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="/login"
                  onClick={() => setSheetOpen(false)}
                  className="group flex items-center justify-between border-b border-[#1A2E25]/10 pb-4 text-3xl font-serif text-[#1A2E25] transition-all hover:text-[#C46A42]"
                >
                  Iniciar sesión
                </a>
              </nav>

              <div className="mt-auto pt-8">
                <Button size="lg" className="h-14 w-full rounded-full bg-[#C46A42] text-lg font-medium text-white hover:bg-[#C46A42]/90 shadow-lg shadow-orange-900/10" asChild>
                  <Link href="/register" onClick={() => setSheetOpen(false)}>
                    Comenzar gratis
                  </Link>
                </Button>
                <p className="mt-6 text-center text-sm font-medium text-[#4A5D53]">
                  Tu mejor amigo, en las mejores manos.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
