"use client";

import { useParams, useRouter } from "next/navigation";
import LayoutContainer from "@/components/LayoutContainer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { colors, spacing } from "@/lib/designSystem";
import { baseHabits } from "@/lib/habitsData";
import { useTodayHabits } from "@/lib/useTodayHabits";

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isDone, toggleToday } = useTodayHabits();

  const id = params?.id;
  const habit = baseHabits.find((h) => String(h.id) === String(id));

  if (!habit) {
    return (
      <LayoutContainer maxWidth={720}>
        <section
          style={{
            paddingTop: spacing.xl,
            paddingBottom: spacing.xl,
          }}
        >
          <Card>
            <h1 style={{ fontSize: 20, marginBottom: spacing.sm }}>
              Hábito não encontrado
            </h1>
            <p
              style={{
                fontSize: 14,
                color: colors.textMuted,
                marginBottom: spacing.md,
              }}
            >
              Não encontramos um hábito com esse identificador. Ele pode ter
              sido removido ou não existe nesta versão.
            </p>
            <Button type="button" onClick={() => router.push("/app/habits")}>
              Voltar para a lista de hábitos
            </Button>
          </Card>
        </section>
      </LayoutContainer>
    );
  }

  const doneToday = isDone(habit.id);

  // dados fake de histórico – só pra visual
  const history = [
    { label: "Hoje", done: doneToday },
    { label: "Ontem", done: true },
    { label: "-2 dias", done: true },
    { label: "-3 dias", done: false },
    { label: "-4 dias", done: true },
    { label: "-5 dias", done: true },
    { label: "-6 dias", done: false },
  ];

  return (
    <LayoutContainer maxWidth={960}>
      <section
        style={{
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
          display: "flex",
          flexDirection: "column",
          gap: spacing.lg,
        }}
      >
        {/* Breadcrumb simples */}
        <button
          type="button"
          onClick={() => router.push("/app/habits")}
          style={{
            border: "none",
            background: "none",
            padding: 0,
            fontSize: 13,
            color: colors.textMuted,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          ← Voltar para hábitos
        </button>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
            {habit.name}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: colors.textMuted,
              marginBottom: spacing.sm,
            }}
          >
            Acompanhe os detalhes, frequência e progresso deste hábito.
          </p>
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 999,
              backgroundColor: "#EEF2FF",
              color: colors.primary,
              fontSize: 12,
            }}
          >
            {habit.frequencyLabel}
          </span>
        </div>

        {/* Grid de cards principais */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
            gap: spacing.lg,
          }}
        >
          {/* Card Resumo / hoje */}
          <Card>
            <h2
              style={{
                fontSize: 16,
                marginTop: 0,
                marginBottom: spacing.sm,
              }}
            >
              Hoje
            </h2>
            <p
              style={{
                fontSize: 14,
                color: colors.textMuted,
                marginTop: 0,
                marginBottom: spacing.md,
              }}
            >
              Controle rapidamente se você já concluiu este hábito no dia.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing.md,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: doneToday ? colors.success : colors.textMuted,
                }}
              >
                Status de hoje:{" "}
                <strong>{doneToday ? "Concluído" : "Pendente"}</strong>
              </span>
              <Button type="button" onClick={() => toggleToday(habit.id)}>
                {doneToday ? "Desmarcar hoje" : "Marcar como concluído"}
              </Button>
            </div>

            <p
              style={{
                fontSize: 12,
                color: colors.textMuted,
                marginTop: 0,
              }}
            >
              Na integração com a API, esta seção será atualizada em tempo real
              com base nos registros diários.
            </p>
          </Card>

          {/* Card Streak / métricas */}
          <Card>
            <h2
              style={{
                fontSize: 16,
                marginTop: 0,
                marginBottom: spacing.sm,
              }}
            >
              Progresso
            </h2>
            <p
              style={{
                fontSize: 14,
                margin: 0,
              }}
            >
              <strong>{habit.baseStreak} dias</strong> de streak atual
            </p>
            <p
              style={{
                fontSize: 13,
                color: colors.textMuted,
                marginTop: spacing.sm,
              }}
            >
              Nesta versão usamos um valor fixo. Com a API, este número
              será calculado com base no histórico real.
            </p>
          </Card>
        </div>

        {/* Card descrição */}
        <Card>
          <h2
            style={{
              fontSize: 16,
              marginTop: 0,
              marginBottom: spacing.sm,
            }}
          >
            Descrição do hábito
          </h2>
          <p
            style={{
              fontSize: 14,
              color: colors.textMuted,
              marginTop: 0,
            }}
          >
            {habit.description ||
              "Você pode usar este espaço para descrever por que este hábito é importante, qual é o objetivo e em que contexto ele será realizado."}
          </p>
        </Card>

        {/* Histórico visual simples */}
        <Card>
          <h2
            style={{
              fontSize: 16,
              marginTop: 0,
              marginBottom: spacing.sm,
            }}
          >
            Histórico recente (exemplo)
          </h2>
          <p
            style={{
              fontSize: 13,
              color: colors.textMuted,
              marginTop: 0,
              marginBottom: spacing.md,
            }}
          >
            Exemplo ilustrativo dos últimos 7 dias. Dias concluídos aparecem em
            destaque. Na integração final, este histórico virá da API.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: spacing.sm,
            }}
          >
            {history.map((day, index) => (
              <div
                key={index}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  border: `1px solid ${
                    day.done ? colors.primary : colors.border
                  }`,
                  backgroundColor: day.done
                    ? "rgba(79, 70, 229, 0.06)"
                    : "#FFFFFF",
                  color: day.done ? colors.primary : colors.textMuted,
                }}
              >
                {day.label} – {day.done ? "✔" : "—"}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </LayoutContainer>
  );
}
