"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function CtaFinal() {
  const reduceMotion = useReducedMotion();
  const anim = !reduceMotion;

  return (
    <section className="relative overflow-hidden bg-foreground py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(1 0 0 / 0.05) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-accent/20 blur-3xl" aria-hidden />

      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        initial={anim ? { opacity: 0, scale: 0.95 } : false}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: anim ? 0.5 : 0, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2 className="font-heading text-4xl font-extrabold text-white md:text-6xl">
          ¿Listo para darle lo mejor a tu compañero?
        </h2>
        <p className="mt-6 text-lg text-white/60">Únete a cientos de familias que ya planifican el cuidado con calma.</p>

        <motion.div
          className="mt-10 inline-block"
          whileHover={anim ? { scale: 1.02 } : {}}
          whileTap={anim ? { scale: 0.98 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Link
            href="/register"
            className="inline-flex rounded-full bg-white px-10 py-4 text-lg font-semibold text-primary transition-all duration-300 hover:bg-white/90"
          >
            Comenzar gratis
          </Link>
        </motion.div>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-white/50">
          <span aria-hidden>🐾</span>
          Más de 500 propietarios ya confían en VETPAL
        </p>
      </motion.div>
    </section>
  );
}
