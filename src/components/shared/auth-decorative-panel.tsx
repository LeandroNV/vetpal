import { PawPrint } from "lucide-react";

/**
 * Columna decorativa del layout de autenticación.
 * Server Component puro: sin estado ni efectos.
 *
 * Estética "Clinical Warm":
 * - Fondo primary (teal) con patrón SVG editorial (dotted grid + arcos)
 * - Logomark tipográfico VETPAL en Bricolage Grotesque 800
 * - Glifo paw en coral como único acento cromático
 * - Tagline corta + footer institucional
 */
export function AuthDecorativePanel() {
  return (
    <aside
      aria-hidden="true"
      className="relative hidden h-full overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between"
    >
      {/* Capa de patrón decorativo */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern
            id="vetpal-dots"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vetpal-dots)" />
      </svg>

      {/* Arcos geométricos sutiles — atmósfera editorial, no ilustración */}
      <svg
        className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] opacity-20"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="200" cy="200" r="80" />
        <circle cx="200" cy="200" r="140" />
        <circle cx="200" cy="200" r="200" />
        <circle cx="200" cy="200" r="260" />
      </svg>

      <svg
        className="pointer-events-none absolute -bottom-40 -left-24 h-[480px] w-[480px] opacity-15"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path d="M 0 200 Q 100 80 200 200 T 400 200" />
        <path d="M 0 240 Q 100 120 200 240 T 400 240" />
        <path d="M 0 280 Q 100 160 200 280 T 400 280" />
      </svg>

      {/* Header: logomark */}
      <header className="relative z-10 flex items-center gap-3 px-12 pt-12">
        <span
          className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground shadow-sm"
          aria-hidden="true"
        >
          <PawPrint className="size-5" strokeWidth={2.5} />
        </span>
        <span
          className="font-display text-2xl font-extrabold tracking-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          VETPAL
        </span>
      </header>

      {/* Contenido central: tagline editorial */}
      <div className="relative z-10 flex flex-col gap-6 px-12">
        <p className="font-display text-5xl font-bold leading-[1.05] tracking-tight xl:text-6xl">
          Cuidado canino,
          <br />
          <span className="text-accent">planeado con cariño.</span>
        </p>
        <p className="max-w-md text-base/relaxed text-primary-foreground/80">
          Agenda citas, lleva el historial clínico de tu perro y conecta con
          veterinarios en una sola plataforma.
        </p>
      </div>

      {/* Footer minúsculo */}
      <footer className="relative z-10 flex items-center justify-between px-12 pb-10 text-xs text-primary-foreground/70">
        <span>© 2026 VETPAL</span>
        <span>Politécnico Grancolombiano</span>
      </footer>
    </aside>
  );
}
