import { colors, radius, spacing } from "@/lib/designSystem";

export default function Button({
  children,
  variant = "primary",
  as = "button",
  ...props
}) {
  const Component = as;

  const isDisabled = props.disabled;

  const baseStyle = {
    padding: `${spacing.sm}px ${spacing.lg}px`,
    borderRadius: radius.md,
    border: "1px solid transparent",
    fontSize: 14,
    fontWeight: 500,
    cursor: isDisabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    transition:
      "background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease",
    opacity: isDisabled ? 0.6 : 1,
  };

  let style = { ...baseStyle };

  if (variant === "primary") {
    style.backgroundColor = colors.primary;
    style.color = "#FFFFFF";
  } else if (variant === "secondary") {
    style.backgroundColor = colors.surface;
    style.borderColor = colors.primary;
    style.color = colors.primary;
  } else if (variant === "ghost") {
    style.backgroundColor = "transparent";
    style.color = colors.primary;
  }

  return (
    <Component style={style} {...props}>
      {children}
    </Component>
  );
}

