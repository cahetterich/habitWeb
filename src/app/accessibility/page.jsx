import LayoutContainer from '@/components/LayoutContainer';
import { colors, spacing } from '@/lib/designSystem';

export default function AccessibilityPage() {
  return (
    <LayoutContainer>
      <section style={{ padding: `${spacing.xl}px 0`, maxWidth: 720 }}>
        <h1 style={{ fontSize: 28, marginBottom: spacing.md }}>Acessibilidade no HabitFlow</h1>
        <p style={{ fontSize: 16, color: colors.textMuted, marginBottom: spacing.lg }}>
          Esta página descreve algumas das decisões de acessibilidade aplicadas na versão web e que
          também serão consideradas no aplicativo mobile.
        </p>

        <ul style={{ fontSize: 14, color: colors.text, lineHeight: 1.7 }}>
          <li>Uso de contraste adequado entre textos, botões e fundos.</li>
          <li>Estrutura semântica das páginas com uso de headings e landmarks.</li>
          <li>Links e botões com rótulos claros e área de clique confortável.</li>
          <li>Navegação por teclado com foco visível em elementos interativos.</li>
          <li>Mensagens de feedback em texto, não apenas por cor.</li>
        </ul>
      </section>
    </LayoutContainer>
  );
}
