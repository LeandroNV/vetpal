"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Apple, Heart, Home, Scissors, Stethoscope, ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Service = {
  name: string;
  description: string;
  price: string;
  icon: LucideIcon;
  color: string;
  bg: string;
};

const SERVICES: Service[] = [
  {
    name: "Salud preventiva",
    description: "Consultas, vacunas y planes preventivos para detectar riesgos a tiempo con el mejor equipo médico.",
    price: "Desde $45.000",
    icon: Stethoscope,
    color: "text-emerald-700",
    bg: "bg-emerald-100/50",
  },
  {
    name: "Estética y Grooming",
    description: "Baño, corte de raza y cuidado del pelaje con protocolos de bienestar que reducen el estrés de tu mascota.",
    price: "Desde $35.000",
    icon: Scissors,
    color: "text-blue-700",
    bg: "bg-blue-100/50",
  },
  {
    name: "Nutrición Especializada",
    description: "Guías alimentarias formuladas según la raza, edad, peso y condiciones preexistentes de tu peludo.",
    price: "Desde $28.000",
    icon: Apple,
    color: "text-orange-700",
    bg: "bg-orange-100/50",
  },
  {
    name: "Guardería Premium",
    description: "Espacios seguros, socialización supervisada y acompañamiento continuo cuando no puedes estar en casa.",
    price: "Desde $40.000",
    icon: Home,
    color: "text-purple-700",
    bg: "bg-purple-100/50",
  },
];

export default function ServiciosSection() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="servicios" className="scroll-mt-24 py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        
        <div className="mb-20 max-w-2xl">
          <p className="text-sm font-bold tracking-widest text-[#C46A42] uppercase mb-4">Nuestra Clínica</p>
          <h2 className="font-serif text-4xl leading-[1.1] text-[#1A2E25] md:text-6xl">
            Todo lo que tu compañero necesita.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left: Accordion / List */}
          <div className="lg:col-span-6 flex flex-col gap-2 relative z-10">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              const isActive = activeIndex === i;
              
              return (
                <button
                  key={s.name}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "group relative flex flex-col items-start rounded-[2rem] p-8 text-left transition-all duration-500",
                    isActive ? s.bg : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex w-full items-center justify-between mb-4">
                    <div className={cn("flex size-12 items-center justify-center rounded-full transition-colors", isActive ? "bg-white shadow-sm" : "bg-white border border-border")}>
                      <Icon className={cn("size-5", isActive ? s.color : "text-muted-foreground")} strokeWidth={2} />
                    </div>
                    <ArrowRight className={cn("size-5 transition-transform duration-300", isActive ? "rotate-45 " + s.color : "opacity-0 -translate-x-4")} />
                  </div>
                  
                  <h3 className={cn("font-serif text-2xl mb-2 transition-colors", isActive ? "text-[#1A2E25]" : "text-muted-foreground")}>
                    {s.name}
                  </h3>
                  
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={reduceMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={reduceMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-[#4A5D53] leading-relaxed mb-6 pt-2">
                          {s.description}
                        </p>
                        <div className="flex items-center justify-between w-full border-t border-black/5 pt-4">
                          <span className="font-medium text-sm text-[#1A2E25]">{s.price}</span>
                          <Link href="/register" className={cn("text-sm font-semibold hover:underline", s.color)}>
                            Agendar Cita
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* Right: Sticky Visual Showcase */}
          <div className="lg:col-span-6 lg:sticky lg:top-32 hidden md:block">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-muted relative shadow-2xl shadow-black/5 ring-1 ring-black/5">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className={cn("absolute inset-0 size-full flex items-center justify-center", SERVICES[activeIndex].bg)}
                >
                  {/* Decorative abstract elements instead of real images for now */}
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)]" />
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative z-10 size-48 rounded-full bg-white shadow-xl flex items-center justify-center"
                  >
                    {(() => {
                      const ActiveIcon = SERVICES[activeIndex].icon;
                      return <ActiveIcon className={cn("size-20", SERVICES[activeIndex].color)} strokeWidth={1.5} />;
                    })()}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
