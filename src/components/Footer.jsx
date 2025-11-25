import { colors, spacing } from '@/lib/designSystem';
import LayoutContainer from './LayoutContainer';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
        marginTop: spacing.xl
      }}
    >
      <LayoutContainer>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
            padding: `${spacing.md}px 0`,
            fontSize: 13,
            color: colors.textMuted
          }}
        >
          <div>HabitFlow © {new Date().getFullYear()}</div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.md
            }}
          >
            <a href="/accessibility">Acessibilidade</a>
            <a href="https://github.com" aria-label="Repositório no GitHub (placeholder)">
              GitHub do projeto
            </a>
          </div>
        </div>
      </LayoutContainer>
    </footer>
  );
}
