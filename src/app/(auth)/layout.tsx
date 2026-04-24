import Link from "next/link";
import { PawPrint } from "lucide-react";
import { AuthDecorativePanel } from "@/components/shared/auth-decorative-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <AuthDecorativePanel />

      <main className="relative flex flex-col">
        {/* Logomark compacto para mobile */}
        <header className="flex items-center gap-2 px-6 pt-6 lg:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 press-feedback"
            aria-label="Inicio VETPAL"
          >
            <span
              className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"
              aria-hidden="true"
            >
              <PawPrint className="size-4" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              VETPAL
            </span>
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-8 sm:py-14">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
