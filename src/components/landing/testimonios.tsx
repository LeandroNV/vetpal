"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";

const ITEMS = [
  {
    quote:
      "VETPAL transformó la manera en que cuido a mi golden. Agendar citas y ver el historial desde el celular es increíble.",
    name: "María González",
    city: "Bogotá",
    initial: "M",
  },
  {
    quote:
      "Antes perdía todos los registros del veterinario. Ahora todo está organizado y puedo compartirlo fácilmente.",
    name: "Carlos Martínez",
    city: "Medellín",
    initial: "C",
  },
  {
    quote:
      "El catálogo de servicios es muy completo. Encontré opciones que ni sabía que existían para mi border collie.",
    name: "Ana Rodríguez",
    city: "Cali",
    initial: "A",
  },
] as const;

export default function Testimonios() {
  const reduceMotion = useReducedMotion();
  const anim = !reduceMotion;

  return (
    <section id="testimonios" className="scroll-mt-24 bg-background py-32">
      <div className="mx-auto mb-12 max-w-2xl px-6 text-center">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">Testimonios</p>
        <h2 className="mt-3 font-heading text-4xl font-bold text-foreground md:text-5xl">Lo que dicen nuestros usuarios</h2>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
        {ITEMS.map((t, i) => (
          <motion.article
            key={t.name}
            className="rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
            initial={anim ? { opacity: 0, y: 24 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: anim ? 0.5 : 0, delay: anim ? i * 0.15 : 0, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="mb-2 font-heading text-5xl font-extrabold leading-none text-primary/20" aria-hidden>
              &ldquo;
            </p>
            <p className="mb-6 leading-relaxed text-foreground italic">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                aria-hidden
              >
                {t.initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.city}</p>
              </div>
              <div className="ml-auto flex gap-0.5" aria-label="Calificación 5 de 5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="size-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
