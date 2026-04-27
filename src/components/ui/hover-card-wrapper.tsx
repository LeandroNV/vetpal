"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function HoverCardWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
