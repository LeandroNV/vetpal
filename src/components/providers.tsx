"use client";

import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={isDashboard ? "system" : "light"}
      forcedTheme={isDashboard ? undefined : "light"}
      enableSystem={isDashboard}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
