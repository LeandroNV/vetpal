"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, ClipboardList, UserPlus, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS: {
  n: string;
  title: string;
  description: string;
  chip: string;
  icon: LucideIcon;
  image: string;
  alt: string;
  fromLeft: boolean;
}[] = [
  {
    n: "01",
    title: "Crea tu cuenta",
    description: "Registra tu perfil y el de tu mascota en menos de 2 minutos.",
    chip: "Registro rápido",
    icon: UserPlus,
    image: "https://images.unsplash.com/photo-1581888227599-779811939961?w=800&q=80",
    alt: "Persona y perro en entorno acogedor",
    fromLeft: true,
  },
  {
    n: "02",
    title: "Elige y agenda",
    description: "Explora el catálogo de servicios y reserva tu cita ideal.",
    chip: "Citas en segundos",
    icon: CalendarCheck,
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80",
    alt: "Atención veterinaria para un canino",
    fromLeft: false,
  },
  {
    n: "03",
    title: "Lleva el control",
    description: "Accede al historial clínico completo de tu canino.",
    chip: "Historial 360°",
    icon: ClipboardList,
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80",
    alt: "Perro mirando a cámara, saludable",
    fromLeft: true,
  },
];

export default function ComoFunciona() {
  const reduceMotion = useReducedMotion();
  const anim = !reduceMotion;

  return (
    <section id="como-funciona" className="scroll-mt-24 bg-muted/30 py-32">
      <div className="mx-auto mb-20 max-w-2xl px-6 text-center">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">Cómo funciona</p>
        <h2 className="mt-3 font-heading text-4xl font-bold text-foreground md:text-5xl">Tan simple como 1, 2, 3</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Menos fricción, más claridad. Así conectas con la veterinaria en minutos, no en horas.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-0 px-6">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const xInit = step.fromLeft ? -40 : 40;
          return (
            <div key={step.n}>
              <motion.div
                className={cn(
                  "relative flex flex-col gap-8 md:items-center md:gap-12",
                  step.fromLeft ? "md:flex-row" : "md:flex-row-reverse"
                )}
                initial={anim ? { opacity: 0, x: xInit } : false}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: anim ? 0.55 : 0, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="relative flex-1">
                  <span
                    className="pointer-events-none font-heading text-[5rem] leading-none font-extrabold text-primary/10 sm:text-8xl"
                    aria-hidden
                  >
                    {step.n}
                  </span>
                  <div className="relative -mt-12 sm:-mt-16">
                    <h3 className="font-heading text-2xl font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{step.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground">
                      <Icon className="size-4 text-primary" strokeWidth={1.75} />
                      {step.chip}
                    </div>
                  </div>
                </div>
                <div className="relative flex-1">
                  <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 400px, 100vw"
                    />
                  </div>
                </div>
              </motion.div>
              {index < STEPS.length - 1 && (
                <div
                  className="mx-auto my-8 h-16 w-px bg-linear-to-b from-primary/50 to-transparent md:my-10"
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
