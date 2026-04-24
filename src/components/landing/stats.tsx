"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const STATS = [
  { value: 500, suffix: "+", label: "Propietarios registrados", format: (n: number) => n.toLocaleString("es-CO") },
  { value: 1200, suffix: "+", label: "Citas agendadas", format: (n: number) => n.toLocaleString("es-CO") },
  { value: 5, suffix: "", label: "Categorías de servicios", format: (n: number) => String(n) },
  { value: 98, suffix: "%", label: "Clientes satisfechos", format: (n: number) => String(n) },
] as const;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedNumber({
  target,
  format,
  durationMs,
  enabled,
}: {
  target: number;
  format: (n: number) => string;
  durationMs: number;
  enabled: boolean;
}) {
  const [v, setV] = useState(() => (enabled ? 0 : target));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  useEffect(() => {
    if (!enabled) {
      setV(target);
      return;
    }
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      setV(Math.round(easeOutCubic(p) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [enabled, inView, target, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(v)}
    </span>
  );
}

export default function Stats() {
  const reduceMotion = useReducedMotion();
  const anim = !reduceMotion;

  return (
    <section className="bg-primary py-20 text-primary-foreground" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        Cifras VETPAL
      </h2>
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className="relative text-center md:border-r md:border-white/20 md:pr-8 last:md:border-0 last:md:pr-0"
            initial={anim ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: anim ? 0.45 : 0, delay: anim ? i * 0.1 : 0, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="font-heading text-5xl font-extrabold text-white">
              <AnimatedNumber target={s.value} format={s.format} durationMs={2000} enabled={anim} />
              {s.suffix}
            </p>
            <p className="mt-2 text-sm font-medium text-white/70">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
