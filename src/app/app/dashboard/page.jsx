"use client";

import Card from "@/components/Card";
import LayoutContainer from "@/components/LayoutContainer";
import { colors } from "@/lib/designSystem";
import { baseHabits } from "@/lib/habitsData";
import { useTodayHabits } from "@/lib/useTodayHabits";
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
      <section className="hf-dashboard-section">
        {/* topo: texto + resumo */}
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
              <p className="hf-summary-text">
                Hoje você concluiu <strong>{doneCount} de {totalHabits} hábitos</strong>.
              </p>

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

        {/* métricas com gradiente */}
        <div className="hf-metric-grid">
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
          <h2 className="hf-today-title">Hábitos de hoje</h2>
          <p className="hf-today-subtitle">
            Veja rapidamente o status dos hábitos do dia. Você pode marcar como
            concluído na tela de Hábitos.
          </p>

          {baseHabits.map((habit) => {
            const done = isDone(habit.id);
            return (
              <div key={habit.id} className="hf-today-row">
                <span>{habit.name}</span>
                <span
                  className={`hf-today-status ${done ? "is-done" : "is-pending"}`}
                >
                  {done ? "✅ Concluído" : "Pendente"}
                </span>
              </div>
            );
          })}
        </Card>

        {/* gráfico */}
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
