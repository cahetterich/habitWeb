// src/components/NavbarApp.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LayoutContainer from "./LayoutContainer";
import { colors, spacing } from "@/lib/designSystem";

export default function NavbarApp() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("Usuário");

  // Função auxiliar para extrair o primeiro nome
  function resolveName(sourceUser) {
    if (!sourceUser) return "Usuário";

    if (sourceUser.firstName && sourceUser.firstName.trim()) {
      return sourceUser.firstName.trim();
    }

    if (sourceUser.name && sourceUser.name.trim()) {
      return sourceUser.name.trim().split(" ")[0];
    }

    return "Usuário";
  }

 
  useEffect(() => {
    // 1) tenta pelo contexto
    if (user) {
      setDisplayName(resolveName(user));
      return;
    }

    // 2) fallback: busca no localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("habitflow:user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setDisplayName(resolveName(parsed));
        } else {
          setDisplayName("Usuário");
        }
      } catch {
        setDisplayName("Usuário");
      }
    }
  }, [user]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header
      style={{
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <LayoutContainer>
        <nav
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: spacing.lg,
          }}
        >
          <Link href="/app/dashboard" style={{ fontWeight: 700, fontSize: 18 }}>
            HabitFlow
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing.md,
              fontSize: 14,
            }}
          >
            <span>{displayName}</span>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                border: "none",
                background: "none",
                padding: 0,
                color: colors.textMuted,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Sair
            </button>
          </div>
        </nav>
      </LayoutContainer>
    </header>
  );
}



