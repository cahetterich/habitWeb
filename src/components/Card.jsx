"use client";

import { colors, radius, spacing } from "@/lib/designSystem";

export default function Card({ children, style }) {
  const baseStyle = {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    border: `1px solid ${colors.border}`,
    padding: spacing.lg,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.03)",
    transition:
      "box-shadow 0.15s ease, transform 0.1s ease, border-color 0.15s ease",
  };

  return (
    <div
      style={{
        ...baseStyle,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 22px 50px rgba(15, 23, 42, 0.06)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = colors.primarySoft || colors.border;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 18px 40px rgba(15, 23, 42, 0.03)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = colors.border;
      }}
    >
      {children}
    </div>
  );
}

