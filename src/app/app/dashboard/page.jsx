//src/app/app/dashboard/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import LayoutContainer from "@/components/LayoutContainer";
import { colors } from "@/lib/designSystem";
import {
  listHabits,
  toggleHabitToday,
  getHabitsSummary, // 🔹 importa o resumo pro gráfico
} from "@/services/habitsService";
import { useAuth } from "@/context/AuthContext";
import "@/styles/dashboard.css";

// Card de métrica com topo em gradiente
function MetricCard({ label, value, suffix, subtitle, gradient }) {
  return (
    <div className="hf-metric-card">
      <div
        className="hf-metric-top"
        style={{
          backgroundImage:
            gradient || `linear-gradient(135deg, ${colors.primary}, #73A9A9)`,
        }}
      >
        {label}
      </div>
      <div className="hf-metric-body">
        <p className="hf-metric-value">
          {value}
          {suffix && <span className="hf-metric-suffix">{suffix}</span>}
        </p>
        {subtitle && <p className="hf-metric-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user: authUser } = useAuth();

  const [habits, setHabits] = useState([]);
  const [summary, setSummary] = useState([]); // 🔹 dados do gráfico
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------- CARREGAR DADOS INICIAIS (hábitos + gráfico) --------
  async function reloadData() {
    try {
      setError("");

      const [habitsData, summaryData] = await Promise.all([
        listHabits(),
        getHabitsSummary(),
      ]);

      setHabits(
        habitsData.map((h) => ({
          ...h,
          doneToday: !!h.doneToday,
        }))
      );

      setSummary(Array.isArray(summaryData) ? summaryData : []);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      setError("Não foi possível carregar seus dados agora.");
      setSummary([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reloadData();
  }, []);

  // -------- MÉTRICAS CALCULADAS --------
  const { totalHabits, doneToday, longestStreak } = useMemo(() => {
    if (!habits || habits.length === 0) {
      return { totalHabits: 0, doneToday: 0, longestStreak: 0 };
    }

    const total = habits.length;
    const done = habits.filter((h) => h.doneToday).length;
    const best = habits.reduce(
      (max, h) => Math.max(max, h.bestStreak ?? h.streak ?? 0),
      0
    );

    return { totalHabits: total, doneToday: done, longestStreak: best };
  }, [habits]);

  const progressPercent =
    totalHabits > 0 ? Math.round((doneToday / totalHabits) * 100) : 0;

  const firstName =
    authUser?.firstName ||
    (authUser?.name ? authUser.name.split(" ")[0] : "Usuário");

  // -------- TOGGLE HOJE (DASHBOARD) --------
  async function handleToggleToday(id) {
    // 1) update otimista
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, doneToday: !habit.doneToday } : habit
      )
    );

    try {
      // 2) chama API
      const result = await toggleHabitToday(id);

      // 3) ajusta hábito com dados reais que voltaram
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === id
            ? {
                ...habit,
                doneToday: result.doneToday,
                streak: result.streak ?? habit.streak,
                bestStreak: result.bestStreak ?? habit.bestStreak,
              }
            : habit
        )
      );

      // 4) atualiza gráfico com os últimos 7 dias já recalculados
      try {
        const summaryData = await getHabitsSummary();
        setSummary(Array.isArray(summaryData) ? summaryData : []);
      } catch (err) {
        console.error("Erro ao atualizar gráfico:", err);
      }
    } catch (err) {
      console.error("Erro ao marcar hábito pelo dashboard:", err);
      alert(
        err.message ||
          "Não foi possível atualizar o hábito. Vou recarregar os dados."
      );
      reloadData();
    }
  }

  return (
    <LayoutContainer maxWidth={1040}>
      <section className="hf-dashboard-section">
        {/* topo: saudação + resumo */}
        <div className="hf-dashboard-hero">
          <div>
            <h1 className="hf-dashboard-title">Olá, {firstName} 👋</h1>
            <p className="hf-dashboard-subtitle">
              Aqui está uma visão geral dos seus hábitos. Acompanhe o que você
              precisa fazer hoje e como anda o seu progresso.
            </p>
          </div>

          <Card>
            <div className="hf-summary-card">
              <h2 className="hf-summary-title">Resumo de hoje</h2>

              {loading ? (
                <p className="hf-summary-text">Carregando...</p>
              ) : (
                <p className="hf-summary-text">
                  Hoje você concluiu{" "}
                  <strong>
                    {doneToday} de {totalHabits} hábitos
                  </strong>
                  .
                </p>
              )}

              <div className="hf-progress-track">
                <div
                  className="hf-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="hf-summary-streak">
                Streak geral: <strong>{longestStreak} dias seguidos</strong>
              </p>
            </div>
          </Card>
        </div>

        {/* métricas em cards */}
        <div className="hf-metric-grid">
          <MetricCard
            label="Hábitos ativos"
            value={totalHabits}
            gradient={`linear-gradient(135deg, ${colors.primary}, #2082DE)`}
            subtitle="Total de hábitos que você acompanha hoje."
          />
          <MetricCard
            label="Concluídos hoje"
            value={doneToday}
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

        {/* Hábitos de hoje com botão de marcar/desmarcar */}
        <Card>
          <h2 className="hf-today-title">Hábitos de hoje</h2>
          <p className="hf-today-subtitle">
            Veja rapidamente o status dos hábitos do dia. Você pode marcar como
            concluído aqui ou na tela de Hábitos.
          </p>

          {loading && <p className="hf-today-row">Carregando hábitos...</p>}

          {error && !loading && (
            <p className="hf-today-row" style={{ color: colors.error }}>
              {error}
            </p>
          )}

          {!loading && !error && habits.length === 0 && (
            <p className="hf-today-row">
              Você ainda não cadastrou hábitos. Comece pela aba Hábitos.
            </p>
          )}

          {!loading &&
            !error &&
            habits.map((habit) => {
              const done = !!habit.doneToday;
              return (
                <div key={habit.id} className="hf-today-row">
                  <span>{habit.name}</span>
                  <span
                    className={`hf-today-status ${
                      done ? "is-done" : "is-pending"
                    }`}
                  >
                    {done ? "✅ Concluído" : "Pendente"}
                  </span>
                  <button
                    type="button"
                    className="hf-habit-toggle"
                    onClick={() => handleToggleToday(habit.id)}
                  >
                    {done ? "Desmarcar" : "Marcar hoje"}
                  </button>
                </div>
              );
            })}
        </Card>

        {/* gráfico conectado à API */}
        <Card>
          <h2 className="hf-graph-title">Últimos 7 dias</h2>

          {summary.length === 0 ? (
            <p className="hf-today-row">
              Ainda não há dados suficientes para o gráfico.
            </p>
          ) : (
            <div aria-hidden="true" className="hf-graph-bars">
              {summary.map((day) => {
                // garante pelo menos uma barrinha mínima quando não completou nada
                const height = day.completionRate > 0 ? day.completionRate : 6;
                return (
                  <div
                    key={day.date}
                    className="hf-graph-bar"
                    style={{ height: `${height}%` }}
                    title={`${day.weekday}: ${day.completed}/${day.totalHabits}`}
                  />
                );
              })}
            </div>
          )}

          <p className="hf-graph-caption">
            Agora este gráfico usa os seus registros reais de conclusão dos
            últimos 7 dias.
          </p>
        </Card>
      </section>
    </LayoutContainer>
  );
}
