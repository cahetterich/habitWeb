"use client";

import Card from "@/components/Card";
import LayoutContainer from "@/components/LayoutContainer";
import { colors, spacing, radius } from "@/lib/designSystem";
import { baseHabits } from "@/lib/habitsData";
import { useTodayHabits } from "@/lib/useTodayHabits";
import { useAuth } from "@/context/AuthContext";

// Card de métrica com topo em gradiente
function MetricCard({ label, value, suffix, subtitle, gradient }) {
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
        minHeight: 120,
      }}
    >
      <div
        style={{
          padding: spacing.sm,
          backgroundImage:
            gradient || `linear-gradient(135deg, ${colors.primary}, #73A9A9)`,
          color: "#FFFFFF",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: spacing.md,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          {value}
          {suffix && (
            <span
              style={{
                fontSize: 15,
                marginLeft: 4,
                fontWeight: 500,
              }}
            >
              {suffix}
            </span>
          )}
        </p>
        {subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: colors.textMuted,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { isDone, doneCount } = useTodayHabits();

  const totalHabits = baseHabits.length;
  const longestStreak =
    baseHabits.length > 0
      ? Math.max(...baseHabits.map((h) => h.baseStreak))
      : 0;

  const progressPercent =
    totalHabits > 0 ? Math.round((doneCount / totalHabits) * 100) : 0;

  const firstName =
    user?.firstName ||
    (user?.name ? user.name.split(" ")[0] : "Usuário");

  return (
    <LayoutContainer maxWidth={1040}>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl,
        }}
      >
        {/* topo: texto + resumo */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
            gap: spacing.lg,
            alignItems: "stretch",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Olá, {firstName} 👋
            </h1>
            <p
              style={{
                color: colors.textMuted,
                fontSize: 14,
                maxWidth: 520,
              }}
            >
              Aqui está uma visão geral dos seus hábitos. Acompanhe o que você
              precisa fazer hoje e como anda o seu progresso.
            </p>
          </div>

          <Card
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.sm,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                margin: 0,
                fontWeight: 600,
              }}
            >
              Resumo de hoje
            </h2>
            <p
              style={{
                fontSize: 14,
                color: colors.textMuted,
                margin: 0,
              }}
            >
              Hoje você concluiu{" "}
              <strong>
                {doneCount} de {totalHabits} hábitos
              </strong>
              .
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
                  width: `${progressPercent}%`,
                  height: "100%",
                  backgroundColor: colors.primary,
                  transition: "width 0.2s ease",
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
              Streak geral:{" "}
              <strong>{longestStreak} dias seguidos</strong>
            </p>
          </Card>
        </div>

        {/* métricas com gradiente */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: spacing.lg,
          }}
        >
          <MetricCard
            label="Hábitos ativos"
            value={totalHabits}
            gradient={`linear-gradient(135deg, ${colors.primary}, #2082DE)`}
            subtitle="Total de hábitos que você acompanha hoje."
          />
          <MetricCard
            label="Concluídos hoje"
            value={doneCount}
            gradient={`linear-gradient(135deg, #73A9A9, #81AA8B)`}
            subtitle="Quantidade de hábitos marcados como feitos no dia."
          />
          <MetricCard
            label="Maior streak"
            value={longestStreak}
            suffix="dias"
            gradient={`linear-gradient(135deg, #3D6262, #C27949)`}
            subtitle="Sequência mais longa sem quebrar o hábito."
          />
        </div>

        {/* hábitos de hoje */}
        <Card>
          <h2 style={{ fontSize: 16, marginBottom: spacing.sm }}>
            Hábitos de hoje
          </h2>
          <p
            style={{
              fontSize: 13,
              color: colors.textMuted,
              marginTop: 0,
              marginBottom: spacing.md,
            }}
          >
            Veja rapidamente o status dos hábitos do dia. Você pode marcar como
            concluído na tela de Hábitos.
          </p>

          {baseHabits.map((habit) => {
            const done = isDone(habit.id);
            return (
              <div
                key={habit.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: `${spacing.xs}px 0`,
                  fontSize: 14,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <span>{habit.name}</span>
                <span
                  style={{
                    fontSize: 13,
                    color: done ? colors.success : colors.textMuted,
                  }}
                >
                  {done ? "✔ Concluído" : "Pendente"}
                </span>
              </div>
            );
          })}
        </Card>

        {/* gráfico */}
        <Card>
          <h2 style={{ fontSize: 16, marginBottom: spacing.md }}>
            Últimos 7 dias
          </h2>
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: spacing.sm,
              height: 120,
            }}
          >
            {[40, 60, 50, 80, 70, 65, 90].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: `${h}%`,
                  backgroundColor: colors.primary,
                  borderRadius: 999,
                }}
              />
            ))}
          </div>
          <p
            style={{
              fontSize: 12,
              color: colors.textMuted,
              marginTop: spacing.sm,
            }}
          >
            Gráfico ilustrativo. Em breve, conectado aos dados reais.
          </p>
        </Card>
      </section>
    </LayoutContainer>
  );
}
