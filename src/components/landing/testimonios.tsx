"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    quote: "VETPAL transformó la manera en que cuido a mi golden. Agendar citas y ver el historial desde el celular es una experiencia premium.",
    name: "María González",
    city: "Bogotá",
    initial: "M",
    bg: "bg-[#E8E1D9]",
  },
  {
    quote: "Antes perdía todos los registros físicos del veterinario. Ahora todo está hermosamente organizado y accesible en un segundo.",
    name: "Carlos Martínez",
    city: "Medellín",
    initial: "C",
    bg: "bg-white",
  },
  {
    quote: "La atención al detalle en esta plataforma es increíble. Me encanta recibir los recordatorios de vacunación a tiempo.",
    name: "Ana Rodríguez",
    city: "Cali",
    initial: "A",
    bg: "bg-[#DDE5E0]",
  },
  {
    quote: "Nunca había sido tan fácil llevar el control del peso y las medicinas de mi perro. Una herramienta indispensable.",
    name: "Juan Felipe",
    city: "Barranquilla",
    initial: "J",
    bg: "bg-[#E5DFE5]",
  },
  {
    quote: "El diseño es exquisito y la funcionalidad impecable. Por fin una app veterinaria que se siente moderna y confiable.",
    name: "Laura G.",
    city: "Cartagena",
    initial: "L",
    bg: "bg-white",
  },
];

export default function Testimonios() {
  return (
    <section id="testimonios" className="overflow-hidden bg-[#1A2E25] py-32 text-white">
      <div className="mx-auto mb-16 px-6 text-center">
        <p className="text-sm font-bold tracking-widest text-[#C46A42] uppercase mb-4">Comunidad</p>
        <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
          Familias felices.
        </h2>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        {/* Left/Right Gradients for smooth fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[15%] md:w-1/3 bg-linear-to-r from-[#1A2E25] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[15%] md:w-1/3 bg-linear-to-l from-[#1A2E25] to-transparent z-10" />

        <div className="flex w-full gap-6 px-4" style={{ "--duration": "40s", "--gap": "1.5rem" } as React.CSSProperties}>
          {[0, 1].map((trackIdx) => (
            <div key={trackIdx} className="flex shrink-0 animate-marquee items-center justify-around gap-6" aria-hidden={trackIdx === 1}>
              {ITEMS.map((t, i) => (
                <article
                  key={`${trackIdx}-${i}`}
                  className={cn(
                    "relative w-[300px] md:w-[350px] shrink-0 rounded-3xl p-8 text-[#1A2E25] transition-transform duration-300 hover:scale-[1.02]",
                    t.bg
                  )}
                >
                  <div className="mb-6 flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="size-4 fill-[#C46A42] text-[#C46A42]" strokeWidth={0} />
                    ))}
                  </div>
                  
                  <p className="mb-8 font-serif text-base md:text-lg leading-relaxed">
                    "{t.quote}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1A2E25]/10 font-serif font-bold">
                      {t.initial}
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-wide">{t.name}</p>
                      <p className="text-xs opacity-70">{t.city}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
