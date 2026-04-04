"use client";

import { Sidebar } from "./sidebar";
import { Toaster } from "sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="ml-[240px] min-h-screen transition-all duration-300">
        <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
      </main>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
          },
        }}
      />
    </div>
  );
}
