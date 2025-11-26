//src/app/app/dashboard/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import LayoutContainer from "@/components/LayoutContainer";
import { colors } from "@/lib/designSystem";
import { listHabits, toggleHabitToday } from "@/services/habitsService";
import { getCurrentUser } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import "@/styles/dashboard.css";

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
  const { user: authUser } = useAuth(); // fallback do contexto
  const [apiUser, setApiUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------- CARREGAR DADOS INICIAIS --------
  async function reloadData() {
    try {
      setError("");
      const [userData, habitsData] = await Promise.all([
        getCurrentUser(),
        listHabits(),
      ]);

      setApiUser(userData);
      setHabits(
        habitsData.map((h) => ({
          ...h,
          doneToday: !!h.doneToday,
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      setError("Não foi possível carregar seus dados agora.");
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
    apiUser?.firstName ||
    authUser?.firstName ||
    (authUser?.name ? authUser.name.split(" ")[0] : "Usuário");

  // -------- TOGGLE HOJE (DASHBOARD) --------
  async function handleToggleToday(id) {
    // 1) update otimista na UI (igual à tela de Hábitos)
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, doneToday: !habit.doneToday } : habit
      )
    );

    try {
      // 2) chama a API para persistir
      const result = await toggleHabitToday(id);

      // 3) ajusta com o que voltou da API (doneToday + streak/bestStreak)
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
    } catch (err) {
      console.error("Erro ao marcar hábito pelo dashboard:", err);
      alert(err.message || "Não foi possível atualizar o hábito. Vou recarregar os dados.");
      // 4) se der ruim, recarrega do servidor para ficar consistente
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
                Streak geral:{" "}
                <strong>{longestStreak} dias seguidos</strong>
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

        {/* gráfico – ainda ilustrativo, mas pronto pra ligar em dados reais depois */}
        <Card>
          <h2 className="hf-graph-title">Últimos 7 dias</h2>
          <div aria-hidden="true" className="hf-graph-bars">
            {[40, 60, 50, 80, 70, 65, 90].map((h, i) => (
              <div key={i} className="hf-graph-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="hf-graph-caption">
            Gráfico ilustrativo. Em breve, conectado aos dados reais.
          </p>
        </Card>
      </section>
    </LayoutContainer>
  );
}

