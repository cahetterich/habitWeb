"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LayoutContainer from "./LayoutContainer";
import { colors, spacing } from "@/lib/designSystem";

export default function NavbarApp() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const displayName =
    user?.firstName ||
    (user?.name ? user.name.split(" ")[0] : "Usuário");

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

