import { spacing } from '@/lib/designSystem';

export default function LayoutContainer({ children, maxWidth = 1120 }) {
  return (
    <div
      style={{
        maxWidth,
        margin: '0 auto',
        padding: `0 ${spacing.lg}px ${spacing.xl}px`
      }}
    >
      {children}
    </div>
  );
}
