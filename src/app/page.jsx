import LayoutContainer from "@/components/LayoutContainer";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FeatureCard from "@/components/FeatureCard";
import { colors, spacing } from "@/lib/designSystem";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <LayoutContainer>
        <section
          id="inicio"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
            gap: spacing.xl,
            padding: `${spacing.xl}px 0`,
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 32,
                marginBottom: spacing.md,
                fontWeight: 700,
              }}
            >
              Acompanhe seus hábitos com clareza e leveza.
            </h1>
            <p
              style={{
                fontSize: 16,
                color: colors.textMuted,
                marginBottom: spacing.lg,
                maxWidth: 520,
              }}
            >
              HabitFlow ajuda você a registrar o que faz todos os dias e enxergar
              seu progresso em gráficos simples, tanto no app mobile quanto na
              web.
            </p>
            <div
              style={{
                display: "flex",
                gap: spacing.md,
                flexWrap: "wrap",
              }}
            >
              <Link href="/signup">
                <Button>Começar agora</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary">Já tenho conta</Button>
              </Link>
            </div>
          </div>

          <div aria-hidden="true">
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.sm,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                Exemplo de dia
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  margin: 0,
                }}
              >
                Hoje você concluiu 3 de 5 hábitos.
              </p>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: colors.primarySoft,
                  overflow: "hidden",
                  marginTop: spacing.sm,
                }}
              >
                <div
                  style={{
                    width: "60%",
                    height: "100%",
                    backgroundColor: colors.primary,
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  margin: 0,
                  marginTop: spacing.sm,
                }}
              >
                Streak geral: <strong>4 dias seguidos</strong>
              </p>
            </Card>
          </div>
        </section>
      </LayoutContainer>

      {/* COMO FUNCIONA */}
      <LayoutContainer>
        <section
          id="como-funciona"
          style={{
            paddingBottom: spacing.xl,
            paddingTop: spacing.lg,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 600,
              marginBottom: spacing.sm,
            }}
          >
            Como funciona na prática
          </h2>
          <p
            style={{
              fontSize: 14,
              color: colors.textMuted,
              marginBottom: spacing.lg,
              maxWidth: 620,
            }}
          >
            Em poucos passos você organiza seus hábitos, marca o que fez no dia
            e acompanha tudo em um só lugar – na web e no aplicativo mobile.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: spacing.lg,
            }}
          >
            <FeatureCard
              emoji="📝"
              title="1. Cadastre seus hábitos"
              gradient={`linear-gradient(135deg, ${colors.primary}, #73A9A9)`}
              description="Use a web ou o app para adicionar hábitos importantes, como leitura, água, exercícios ou estudos. Defina frequência e uma descrição rápida."
            />

            <FeatureCard
              emoji="✅"
              title="2. Marque o que fez no dia"
              gradient={`linear-gradient(135deg, #73A9A9, #81AA8B)`}
              description="Na tela de Hábitos, marque o que você já concluiu hoje. O progresso é salvo e refletido no dashboard automaticamente."
            />

            <FeatureCard
              emoji="📊"
              title="3. Visualize seu progresso"
              gradient={`linear-gradient(135deg, #3D6262, ${colors.primary})`}
              description="Acompanhe streaks, hábitos concluídos no dia e um resumo visual simples. Ideal para manter o foco sem se perder em telas complexas."
            />
          </div>
        </section>
      </LayoutContainer>

      {/* PARA QUEM É */}
      <LayoutContainer>
        <section
          style={{
            paddingBottom: spacing.xl,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 600,
              marginBottom: spacing.sm,
            }}
          >
            Para quem é o HabitFlow?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: colors.textMuted,
              marginBottom: spacing.lg,
              maxWidth: 620,
            }}
          >
            Pensamos o HabitFlow para quem quer organizar a rotina sem
            complicação. Do dia a dia pessoal até estudos e produtividade.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: spacing.lg,
            }}
          >
            <FeatureCard
              emoji="🎓"
              title="Estudantes e concurseiros"
              gradient={`linear-gradient(135deg, ${colors.primary}, #2082DE)`}
              description="Acompanhe horas de estudo, leitura, revisões e simulados. Visualize quais hábitos mais contribuem para o seu foco."
            />

            <FeatureCard
              emoji="🧘‍♀️"
              title="Rotina de bem-estar"
              gradient={`linear-gradient(135deg, #81AA8B, #73A9A9)`}
              description="Crie hábitos de sono, água, alongamento ou meditação. Veja como pequenas ações consistentes mudam o seu dia."
            />

            <FeatureCard
              emoji="💻"
              title="Produtividade pessoal"
              gradient={`linear-gradient(135deg, #3D6262, #C27949)`}
              description="Monitore tarefas recorrentes, rotinas de trabalho e blocos de foco. Tenha clareza do que precisa ser feito hoje."
            />
          </div>
        </section>
      </LayoutContainer>
    </>
  );
}


