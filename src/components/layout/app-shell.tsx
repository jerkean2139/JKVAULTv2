"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/shared/error-boundary";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return (
      <div className="dark min-h-screen bg-background text-foreground">
        {children}
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

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="md:ml-[240px] min-h-screen transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6 pt-16 md:pt-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
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
