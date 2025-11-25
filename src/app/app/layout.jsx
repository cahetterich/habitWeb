"use client";

import NavbarApp from "@/components/NavbarApp";
import SidebarApp from "@/components/SidebarApp";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { colors, spacing } from "@/lib/designSystem";

export default function AppLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // sempre que mudar auth ou rota, garante que área /app está protegida
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading) {
    // tela simples de carregamento enquanto checa localStorage
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.textMuted,
        }}
      >
        Carregando…
      </div>
    );
  }

  if (!isAuthenticated) {
    // evita piscar layout da área logada enquanto faz redirect
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavbarApp />
      <div style={{ display: "flex", flex: 1 }}>
        <SidebarApp />
        <main
          style={{
            flex: 1,
            paddingLeft: spacing.lg,
            paddingRight: spacing.lg,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
