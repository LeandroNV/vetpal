"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Apple, Heart, Home, Scissors, Stethoscope, type LucideIcon } from "lucide-react";

type Service = {
  name: string;
  description: string;
  price: string;
  icon: LucideIcon;
};

const SERVICES: Service[] = [
  {
    name: "Salud preventiva",
    description: "Consultas, vacunas y planes preventivos para detectar riesgos a tiempo.",
    price: "Desde $45.000",
    icon: Stethoscope,
  },
  {
    name: "Estética",
    description: "Baño, grooming y cuidado del pelaje con protocolos de bienestar canino.",
    price: "Desde $35.000",
    icon: Scissors,
  },
  {
    name: "Nutrición",
    description: "Guías y planes alimentarios según raza, edad y condición de tu peludo.",
    price: "Desde $28.000",
    icon: Apple,
  },
  {
    name: "Guardería",
    description: "Espacios seguros y acompañamiento cuando no puedes estar cerca.",
    price: "Desde $40.000",
    icon: Home,
  },
  {
    name: "Funerarios",
    description: "Acompañamiento respetuoso y humano en los momentos más difíciles.",
    price: "Consultar",
    icon: Heart,
  },
];

export default function ServiciosSection() {
  const reduceMotion = useReducedMotion();
  const anim = !reduceMotion;

  return (
    <section id="servicios" className="scroll-mt-24 bg-background py-32">
      <div className="mx-auto mb-16 max-w-2xl px-6 text-center">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">Nuestros servicios</p>
        <h2 className="mt-3 font-heading text-4xl font-bold text-foreground md:text-5xl">Todo lo que tu canino necesita</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Un catálogo claro de servicios para cuidar la salud, el bienestar y la tranquilidad de tu compañero.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.article
              key={s.name}
              className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              initial={anim ? { opacity: 0, y: 40 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: anim ? 0.5 : 0, delay: anim ? i * 0.1 : 0, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-6 text-primary" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold text-foreground">{s.price}</span>
                <Link
                  href="/register"
                  className="text-sm font-medium text-primary transition-transform duration-300 group-hover:translate-x-1"
                >
                  Agendar →
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
