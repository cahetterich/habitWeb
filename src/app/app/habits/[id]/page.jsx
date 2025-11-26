// src/app/app/habits/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LayoutContainer from "@/components/LayoutContainer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { colors, spacing } from "@/lib/designSystem";
import { getHabit, toggleHabitToday } from "@/services/habitsService";

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const data = await getHabit(id);
        setHabit(data);
      } catch (err) {
        console.error("Erro ao carregar hábito:", err);
        setError(
          "Não encontramos um hábito com esse identificador. Ele pode ter sido removido ou não existe nesta versão."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function handleToggleToday() {
    if (!habit) return;

    try {
      const result = await toggleHabitToday(habit.id);
      setHabit((prev) =>
        prev
          ? {
              ...prev,
              doneToday: result.doneToday,
              bestStreak: result.bestStreak,
              streak: result.streak,
            }
          : prev
      );
    } catch (err) {
      console.error("Erro ao marcar hoje:", err);
      alert("Não foi possível atualizar o status de hoje. Tente novamente.");
    }
  }

  if (loading) {
    return (
      <LayoutContainer maxWidth={720}>
        <section style={{ paddingTop: spacing.lg }}>
          <Card>
            <p>Carregando hábito...</p>
          </Card>
        </section>
      </LayoutContainer>
    );
  }

  if (error || !habit) {
    return (
      <LayoutContainer maxWidth={720}>
        <section style={{ paddingTop: spacing.lg }}>
          <Card>
            <h1 style={{ fontSize: 22, marginBottom: 8 }}>Hábito não encontrado</h1>
            <p
              style={{
                fontSize: 14,
                color: colors.textMuted,
                marginBottom: spacing.md,
              }}
            >
              {error}
            </p>
            <Button type="button" onClick={() => router.push("/app/habits")}>
              Voltar para a lista de hábitos
            </Button>
          </Card>
        </section>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer maxWidth={720}>
      <section
        style={{
          paddingTop: spacing.lg,
          display: "flex",
          flexDirection: "column",
          gap: spacing.lg,
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/app/habits")}
          style={{
            border: "none",
            background: "none",
            color: colors.textMuted,
            fontSize: 13,
            textAlign: "left",
            padding: 0,
            cursor: "pointer",
          }}
        >
          ← Voltar para hábitos
        </button>

        <Card>
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
            Frequência: {habit.frequencyLabel || "—"}
          </p>

          {habit.description && (
            <p style={{ fontSize: 14, marginBottom: spacing.md }}>
              {habit.description}
            </p>
          )}

          <div
            style={{
              marginTop: spacing.md,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: spacing.md,
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: habit.doneToday ? colors.success : colors.textMuted,
              }}
            >
              Status de hoje:{" "}
              <strong>{habit.doneToday ? "Concluído" : "Pendente"}</strong> ·
              Streak <strong>{habit.bestStreak ?? 0} dias</strong>
            </span>

            <Button type="button" onClick={handleToggleToday}>
              {habit.doneToday ? "Desmarcar hoje" : "Marcar como concluído"}
            </Button>
          </div>
        </Card>
      </section>
    </LayoutContainer>
  );
}
