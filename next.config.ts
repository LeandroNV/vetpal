import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del workspace de Turbopack para silenciar el warning de
  // múltiples lockfiles (existe un package-lock.json en el directorio padre
  // que Next.js 16 detecta por defecto como root).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
