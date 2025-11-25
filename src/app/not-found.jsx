import LayoutContainer from '@/components/LayoutContainer';
import Button from '@/components/Button';
import Link from 'next/link';
import { spacing } from '@/lib/designSystem';

export default function NotFound() {
  return (
    <LayoutContainer>
      <section style={{ padding: `${spacing.xl}px 0`, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, marginBottom: spacing.md }}>Página não encontrada</h1>
        <p style={{ marginBottom: spacing.lg }}>
          Não encontramos o que você estava procurando. Que tal voltar para o início?
        </p>
        <Link href="/">
          <Button>Voltar para página inicial</Button>
        </Link>
      </section>
    </LayoutContainer>
  );
}
