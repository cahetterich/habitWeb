"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors, spacing, radius } from "@/lib/designSystem";

const links = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/habits", label: "Hábitos" },
  { href: "/app/profile", label: "Perfil" },
];

export default function SidebarApp() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navegação da aplicação"
      style={{
        width: 220,
        padding: spacing.lg,
        borderRight: `1px solid ${colors.border}`,
        minHeight: "calc(100vh - 64px)",
        backgroundColor: colors.surface,
      }}
    >
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.sm,
        }}
      >
        {links.map((link) => {
          const active = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: `${spacing.sm}px ${spacing.md}px`,
                borderRadius: radius.md,
                fontSize: 14,
                backgroundColor: active ? colors.primarySoft : "transparent",
                color: active ? colors.primary : colors.text,
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

