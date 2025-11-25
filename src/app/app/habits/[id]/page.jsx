"use client";

import { useParams, useRouter } from "next/navigation";
import LayoutContainer from "@/components/LayoutContainer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { baseHabits } from "@/lib/habitsData";
import { useTodayHabits } from "@/lib/useTodayHabits";
import "@/styles/habit-detail.css";

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isDone, toggleToday } = useTodayHabits();

  const id = params?.id;
  const habit = baseHabits.find((h) => String(h.id) === String(id));

  if (!habit) {
    return (
      <LayoutContainer maxWidth={720}>
        <section className="hf-habit-section">
          <Card>
            <h1 className="hf-not-found-title">Hábito não encontrado</h1>
            <p className="hf-not-found-text">
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

  // dados fake de hist�rico � s� pra visual
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
      <section className="hf-habit-section">
        {/* Breadcrumb simples */}
        <button
          type="button"
          onClick={() => router.push("/app/habits")}
          className="hf-habit-breadcrumb"
        >
          ? Voltar para hábitos
        </button>

        {/* Header */}
        <div>
          <h1 className="hf-habit-title">{habit.name}</h1>
          <p className="hf-habit-subtitle">
            Acompanhe os detalhes, frequência e progresso deste h�bito.
          </p>
          <span className="hf-habit-frequency">{habit.frequencyLabel}</span>
        </div>

        {/* Grid de cards principais */}
        <div className="hf-habit-main-grid">
          {/* Card Resumo / hoje */}
          <Card>
            <h2 className="hf-card-title">Hoje</h2>
            <p className="hf-card-subtitle">
              Controle rapidamente se você já concluiu este hábito no dia.
            </p>

            <div className="hf-today-row">
              <span className={`hf-today-status ${doneToday ? "is-done" : ""}`}>
                Status de hoje: <strong>{doneToday ? "Conclu�do" : "Pendente"}</strong>
              </span>
              <Button type="button" onClick={() => toggleToday(habit.id)}>
                {doneToday ? "Desmarcar hoje" : "Marcar como conclu�do"}
              </Button>
            </div>

            <p className="hf-card-note">
              Na integração com a API, esta se��o ser� atualizada em tempo real
              com base nos registros di�rios.
            </p>
          </Card>

          {/* Card Streak / m�tricas */}
          <Card>
            <h2 className="hf-card-title">Progresso</h2>
            <p className="hf-progress-text">
              <strong>{habit.baseStreak} dias</strong> de streak atual
            </p>
            <p className="hf-progress-hint">
              Nesta vers�o usamos um valor fixo. Com a API, este n�mero ser�
              calculado com base no hist�rico real.
            </p>
          </Card>
        </div>

        {/* Card descri��o */}
        <Card>
          <h2 className="hf-card-title">Descri��o do h�bito</h2>
          <p className="hf-description">
            {habit.description ||
              "Voc� pode usar este espa�o para descrever por que este h�bito � importante, qual � o objetivo e em que contexto ele ser� realizado."}
          </p>
        </Card>

        {/* Hist�rico visual simples */}
        <Card>
          <h2 className="hf-card-title">Hist�rico recente (exemplo)</h2>
          <p className="hf-history-description">
            Exemplo ilustrativo dos �ltimos 7 dias. Dias conclu�dos aparecem em
            destaque. Na integra��o final, este hist�rico vir� da API.
          </p>

          <div className="hf-history-list">
            {history.map((day, index) => (
              <div
                key={index}
                className={`hf-history-badge ${day.done ? "is-done" : ""}`}
              >
                {day.label} � {day.done ? "?" : "?"}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </LayoutContainer>
  );
}
