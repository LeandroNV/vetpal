import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b px-6 py-4">
        <p className="text-sm font-medium">VETPAL · Dashboard</p>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
