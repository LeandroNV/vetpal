"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CalendarCheck, ClipboardList, UserPlus, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    n: "01",
    title: "Crea tu cuenta en minutos",
    description: "Un proceso de registro diseñado para ser rápido y sin fricciones. Registra tu perfil y añade los detalles más importantes de tu mascota para que podamos ofrecerle la mejor atención desde el primer día.",
    icon: UserPlus,
    image: "https://images.unsplash.com/photo-1581888227599-779811939961?w=800&q=80",
    color: "bg-[#E8E1D9]",
    textColor: "text-[#4A3B32]",
  },
  {
    n: "02",
    title: "Elige y agenda con confianza",
    description: "Navega por nuestro catálogo de servicios veterinarios. Desde vacunas hasta estética, elige el horario que mejor se adapte a tu rutina y asegura la cita en un par de clics.",
    icon: CalendarCheck,
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80",
    color: "bg-[#DDE5E0]",
    textColor: "text-[#2A3B32]",
  },
  {
    n: "03",
    title: "Lleva el control total",
    description: "Accede al historial clínico completo, recibe recordatorios de salud preventivos y ten la tranquilidad de que la información vital de tu compañero siempre está a tu alcance.",
    icon: ClipboardList,
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80",
    color: "bg-[#E5DFE5]",
    textColor: "text-[#3B324A]",
  },
];

export default function ComoFunciona() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section id="como-funciona" className="bg-[#FDFBF7] py-32" ref={containerRef}>
      <div className="mx-auto mb-24 max-w-3xl px-6 text-center">
        <p className="text-sm font-bold tracking-widest text-[#C46A42] uppercase mb-4">El Proceso</p>
        <h2 className="font-serif text-5xl leading-[1.1] text-[#1A2E25] md:text-6xl">
          Tan simple como 1, 2, 3.
        </h2>
        <p className="mt-6 text-lg text-[#4A5D53] max-w-xl mx-auto">
          Menos fricción, más claridad. Conecta con la mejor atención veterinaria de forma inmediata y organizada.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-32">
        {STEPS.map((step, i) => {
          const targetScale = 1 - (STEPS.length - i - 1) * 0.05;
          return (
            <Card 
              key={step.n} 
              step={step} 
              i={i} 
              progress={scrollYProgress} 
              range={[i * 0.25, 1]} 
              targetScale={targetScale} 
            />
          );
        })}
      </div>
    </section>
  );
}

function Card({ step, i, progress, range, targetScale }: any) {
  const reduceMotion = useReducedMotion();
  const Icon = step.icon;
  
  // Create a springy scale effect based on scroll
  const scale = useTransform(progress, range, [1, targetScale]);
  // Use constant 1 if reduced motion is preferred
  const actualScale = reduceMotion ? 1 : scale;

  return (
    <div className="sticky flex items-center justify-center pt-8" style={{ top: `calc(10vh + ${i * 40}px)` }}>
      <motion.div 
        style={{ scale: actualScale, transformOrigin: "top" }}
        className={cn(
          "relative flex flex-col md:flex-row gap-8 overflow-hidden rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5 ring-1 ring-black/5 w-full",
          step.color
        )}
      >
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-4">
            <span className={cn("font-serif text-5xl font-light opacity-50", step.textColor)}>
              {step.n}
            </span>
            <div className={cn("flex size-12 items-center justify-center rounded-full bg-white/40 backdrop-blur-md", step.textColor)}>
              <Icon className="size-5" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className={cn("font-serif text-3xl md:text-4xl mb-4 font-medium", step.textColor)}>
            {step.title}
          </h3>
          <p className={cn("text-lg leading-relaxed opacity-80", step.textColor)}>
            {step.description}
          </p>
        </div>
        
        <div className="flex-1 relative aspect-[4/3] md:aspect-auto overflow-hidden rounded-2xl">
          <Image
            src={step.image}
            alt={step.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 400px, 100vw"
          />
        </div>
      </motion.div>
    </div>
  );
}
