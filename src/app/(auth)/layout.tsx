import Link from "next/link";
import Image from "next/image";
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
            className="flex items-center press-feedback"
            aria-label="Inicio VETPAL"
          >
            <Image src="/images/landing/logo.svg" alt="VETPAL Logo" width={120} height={28} className="h-7 w-auto" />
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-8 sm:py-14">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
