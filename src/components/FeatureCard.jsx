import { colors, radius, spacing } from "@/lib/designSystem";

export default function FeatureCard({
  title,
  description,
  emoji,
  gradient,
}) {
  return (
    <div
      style={{
        borderRadius: radius.lg || 20,
        overflow: "hidden",
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
        display: "flex",
        flexDirection: "column",
        minHeight: 180,
      }}
    >
      {/* topo colorido em gradiente */}
      <div
        style={{
          padding: spacing.md,
          backgroundImage:
            gradient ||
            `linear-gradient(135deg, ${colors.primary}, #73A9A9)`,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          gap: spacing.sm,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {emoji}
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
      </div>

      {/* corpo branco */}
      <div
        style={{
          padding: spacing.md,
          fontSize: 14,
          color: colors.textMuted,
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {description}
      </div>
    </div>
  );
}
