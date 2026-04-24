"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const bezier: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

function scrollToComoFunciona() {
  document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const t = (delay: number, duration = 0.6) =>
    reduceMotion ? { duration: 0 } : { delay, duration, ease: bezier };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,var(--primary),transparent_55%)] opacity-30"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background"
        aria-hidden
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={t(0.1, 0.45)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm"
        >
          <span aria-hidden>🐾</span>
          Plataforma veterinaria digital · Colombia
        </motion.div>

        <motion.h1
          className="mb-6 max-w-5xl font-heading text-5xl leading-[0.9] font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.2, 0.7)}
        >
          <span className="block">Tu mejor amigo</span>
          <span className="mt-1 block bg-linear-to-r from-accent to-primary bg-clip-text text-transparent">
            merece lo mejor
          </span>
        </motion.h1>

        <motion.p
          className="mb-10 max-w-2xl font-sans text-lg leading-relaxed text-white/70 md:text-xl"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.4, 0.55)}
        >
          Agenda citas, historial clínico y servicios de confianza para tu canino — todo en un solo lugar, con la
          claridad que mereces.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.6, 0.55)}
        >
          <Link
            href="/register"
            className="inline-flex rounded-full bg-white px-8 py-3 font-semibold text-primary transition-all duration-300 hover:bg-white/90"
          >
            Comenzar gratis →
          </Link>
          <button
            type="button"
            onClick={scrollToComoFunciona}
            className="rounded-full border border-white/30 px-8 py-3 text-white transition-all duration-300 hover:bg-white/10"
          >
            Ver cómo funciona
          </button>
        </motion.div>
      </div>

      <motion.a
        href="#servicios"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80"
        aria-label="Continuar a servicios"
        animate={
          reduceMotion
            ? { y: 0 }
            : {
                y: [0, 8, 0],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <ChevronDown className="size-7" strokeWidth={1.75} />
      </motion.a>
    </section>
  );
}
