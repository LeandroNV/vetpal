"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

const bezier: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const t = (delay: number, duration = 0.8) =>
    reduceMotion ? { duration: 0 } : { delay, duration, ease: bezier };

  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-[#FDFBF7] pt-24 pb-16 lg:pt-32">
      {/* Background ambient elements */}
      <div className="absolute top-0 right-0 -mr-[20%] -mt-[10%] h-[800px] w-[800px] rounded-full bg-orange-100/40 blur-[120px]" aria-hidden />
      <div className="absolute bottom-0 left-0 -ml-[10%] -mb-[10%] h-[600px] w-[600px] rounded-full bg-emerald-50/60 blur-[100px]" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.1)}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/60 px-4 py-1.5 text-xs font-medium text-primary tracking-wide uppercase backdrop-blur-sm shadow-sm w-[calc(100%-40%)]"
            >
              <PawPrint className="size-3.5" />
              <span>Clínica Digital VETPAL</span>
            </motion.div>

            <motion.h1
              className="mb-6 font-serif text-[3.5rem] leading-[1.05] tracking-tight text-[#1A2E25] md:text-7xl lg:text-[5.5rem]"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.2, 0.9)}
            >
              Tu mejor amigo, <br />
              <span className="italic text-[#C46A42] font-medium pr-4">en las mejores</span> manos.
            </motion.h1>

            <motion.p
              className="mb-10 max-w-xl font-sans text-lg leading-relaxed text-[#4A5D53] md:text-xl"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.4)}
            >
              Agenda citas, lleva el historial clínico y gestiona los servicios preventivos con la claridad y elegancia que tu mascota merece. Todo en un solo lugar.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-5"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.6)}
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-[#1A2E25] px-8 py-4 text-sm font-medium text-white transition-all hover:bg-[#2A4538] hover:shadow-lg hover:-translate-y-0.5"
              >
                Comenzar ahora
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-medium text-[#1A2E25] transition-colors hover:text-[#C46A42]"
              >
                Ver cómo funciona
              </a>
            </motion.div>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="lg:col-span-5 relative h-[450px] lg:h-[600px]">
            <motion.div
              initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={t(0.3, 1)}
              className="absolute lg:top-10 right-0 lg:right-4 w-full lg:w-[85%] rounded-[2rem] bg-white p-2 shadow-2xl shadow-primary/5 ring-1 ring-black/5"
            >
              <div className="aspect-4/5 overflow-hidden rounded-[1.5rem] bg-muted relative">
                <video
                  src="/videos/hero-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 size-full object-cover opacity-90"
                />
                {/* Decorative UI Overlay */}
                <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6 rounded-2xl bg-white/80 p-4 lg:p-5 backdrop-blur-md shadow-lg border border-white/40">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-[#C46A42]/10 flex items-center justify-center text-[#C46A42] shrink-0">
                      <PawPrint className="size-5 lg:size-6" />
                    </div>
                    <div>
                      <p className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Próxima Cita</p>
                      <p className="font-serif text-base lg:text-lg text-[#1A2E25]">Vacunación Anual</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Secondary floating card */}
            <motion.div
              initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={t(0.7, 0.8)}
              className="absolute top-16 lg:top-28 left-0 lg:-left-10 rounded-2xl bg-white p-4 lg:p-5 shadow-xl shadow-black/5 ring-1 ring-black/5 flex items-center gap-3 lg:gap-4 z-20 scale-90 lg:scale-100 origin-top-left"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={cn("h-10 w-10 rounded-full border-2 border-white bg-muted", i===1 ? "bg-orange-200" : i===2 ? "bg-emerald-200" : "bg-blue-200")} />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A2E25]">+2,000 mascotas</p>
                <p className="text-xs text-muted-foreground">atendidas este mes</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
