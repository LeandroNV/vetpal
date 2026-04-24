import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del workspace de Turbopack para silenciar el warning de
  // múltiples lockfiles (existe un package-lock.json en el directorio padre
  // que Next.js 16 detecta por defecto como root).
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
