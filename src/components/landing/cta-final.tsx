"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CtaFinal() {
  const reduceMotion = useReducedMotion();
  const anim = !reduceMotion;

  return (
    <section className="relative overflow-hidden bg-[#C46A42] py-40">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          backgroundSize: "200px 200px"
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -top-32 -right-32 size-[500px] rounded-full bg-orange-300/30 blur-3xl" aria-hidden />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        initial={anim ? { opacity: 0, y: 30 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: anim ? 0.6 : 0, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2 className="font-serif text-[4rem] leading-[0.95] text-[#FDFBF7] md:text-[6rem]">
          El mejor momento <br />
          <span className="italic opacity-90">es ahora.</span>
        </h2>
        <p className="mt-8 text-xl text-[#FDFBF7]/80 max-w-xl mx-auto font-medium">
          Únete a cientos de familias que ya gestionan la salud de su mascota con tranquilidad y elegancia.
        </p>

        <motion.div
          className="mt-12 inline-block"
          whileHover={anim ? { scale: 1.05 } : {}}
          whileTap={anim ? { scale: 0.95 } : {}}
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-3 rounded-full bg-[#FDFBF7] px-10 py-5 text-lg font-medium text-[#C46A42] transition-colors hover:bg-white shadow-xl shadow-black/10"
          >
            Comenzar gratis
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
