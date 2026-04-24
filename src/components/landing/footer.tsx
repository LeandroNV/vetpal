import Link from "next/link";
import { PawPrint } from "lucide-react";

const FOOTER_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-foreground py-12 text-background" role="contentinfo">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3 md:items-start">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="VETPAL, inicio">
            <PawPrint className="size-6 text-accent" strokeWidth={1.75} />
            <span className="font-heading text-lg font-extrabold text-white">VETPAL</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-white/50">
            Cuidado canino, planeado con cariño — en un solo lugar.
          </p>
        </div>

        <nav
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-center"
          aria-label="Pie de página"
        >
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-white/50 transition-all duration-300 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="text-center md:text-right">
          <p className="text-sm text-white/30">© 2026 VETPAL</p>
          <p className="mt-1 text-xs text-white/20">Politécnico Grancolombiano</p>
        </div>
      </div>
    </footer>
  );
}
