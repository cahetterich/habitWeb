"use client";

import Link from "next/link";
import { colors, spacing } from "@/lib/designSystem";
import LayoutContainer from "./LayoutContainer";
import { useAuth } from "@/context/AuthContext";

export default function NavbarPublic() {
  const { isAuthenticated } = useAuth();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        backdropFilter: "blur(8px)",
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
          aria-label="Navegação principal"
        >
          <Link href="/" style={{ fontWeight: 700, fontSize: 18 }}>
            HabitFlow
          </Link>

          <div
            style={{
              display: "flex",
              gap: spacing.md,
              alignItems: "center",
              fontSize: 14,
            }}
          >
            {/* Link para seção "Como funciona" da própria landing */}
            <Link href="/#como-funciona">Como funciona</Link>

            {!isAuthenticated && (
              <>
                <Link href="/login">Entrar</Link>
                <Link
                  href="/signup"
                  style={{
                    padding: `${spacing.sm}px ${spacing.md}px`,
                    borderRadius: 999,
                    backgroundColor: colors.primary,
                    color: "#FFFFFF",
                    fontWeight: 500,
                  }}
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </nav>
      </LayoutContainer>
    </header>
  );
}
