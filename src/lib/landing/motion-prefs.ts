"use client";

import { useReducedMotion } from "framer-motion";

/** Framer-cubic ease alineada a `duration-entrance` en design-tokens. */
export const EASE_OUT_ENTRANCE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * `prefers-reduced-motion` vía Framer; usar para desactivar o acortar animaciones.
 */
export function usePrefersReducedMotion() {
  return useReducedMotion() ?? false;
}
