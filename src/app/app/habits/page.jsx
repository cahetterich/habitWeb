// src/app/app/habits/page.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Card from "@/components/Card";
import LayoutContainer from "@/components/LayoutContainer";
import Button from "@/components/Button";
import Link from "next/link";
import { spacing } from "@/lib/designSystem";
import { listHabits, toggleHabitToday } from "@/services/habitsService";
import "@/styles/habits.css";

const fallbackHabits = [
  { id: "1", name: "Ler 10 páginas", freq: "Diário", today: false, streak: "3 dias" },
  { id: "2", name: "Beber 2L de água", freq: "Seg à Sex", today: false, streak: "7 dias" },
  { id: "3", name: "Estudar 30min", freq: "Diário", today: false, streak: "1 dia" },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState(fallbackHabits);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | done | pending
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const apiHabits = await listHabits();

        const mapped = apiHabits.map((h) => ({
          id: h.id,
          name: h.name,
          freq: h.frequencyLabel || "—",
          today: !!h.doneToday,
          streak: h.bestStreak != null ? `${h.bestStreak} dias` : "0 dia",
        }));

        setHabits(mapped);
      } catch (err) {
        console.error("Erro ao carregar hábitos da API:", err);
        setHabits(fallbackHabits);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const activeCount = habits.length;
  const doneTodayCount = habits.filter((h) => h.today).length;

  async function handleToggleToday(id) {
    // update otimista
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, today: !habit.today } : habit
      )
    );

    try {
      const result = await toggleHabitToday(id);

      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === id
            ? {
                ...habit,
                today: result.doneToday,
                streak: `${result.bestStreak ?? 0} dias`,
              }
            : habit
        )
      );
    } catch (err) {
      console.error("Erro ao marcar hoje:", err);
      alert("Não foi possível atualizar o status de hoje. Vou recarregar a lista.");

      try {
        const apiHabits = await listHabits();
        const mapped = apiHabits.map((h) => ({
          id: h.id,
          name: h.name,
          freq: h.frequencyLabel || "—",
          today: !!h.doneToday,
          streak: h.bestStreak != null ? `${h.bestStreak} dias` : "0 dia",
        }));
        setHabits(mapped);
      } catch (e) {
        console.error("Erro ao recarregar hábitos:", e);
      }
    }
  }

  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (search && !habit.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (filter === "done") return habit.today;
      if (filter === "pending") return !habit.today;
      return true;
    });
  }, [habits, filter, search]);

  return (
    <LayoutContainer>
      <section className="hf-habits-section">
        <div className="hf-habits-header">
          <div>
            <h1 className="hf-habits-title">Seus hábitos</h1>
            <p className="hf-habits-subtitle">
              Liste, filtre e acompanhe todos os seus hábitos diários. Clique no nome do
              hábito para ver mais detalhes.
            </p>
          </div>
          <Link href="/app/habits/new">
            <Button>+ Adicionar hábito</Button>
          </Link>
        </div>

        <Card style={{ padding: spacing.md }}>
          <div className="hf-habits-filter-card">
            <div className="hf-habits-filter-row">
              <div className="hf-habits-stats">
                <strong>{activeCount}</strong> hábitos ativos •{" "}
                <strong>{doneTodayCount}</strong> concluídos hoje
              </div>

              <div className="hf-habits-filter-actions">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`hf-filter-pill ${filter === "all" ? "is-active" : ""}`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("done")}
                  className={`hf-filter-pill ${filter === "done" ? "is-active" : ""}`}
                >
                  Concluídos hoje
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("pending")}
                  className={`hf-filter-pill ${filter === "pending" ? "is-active" : ""}`}
                >
                  Pendentes
                </button>
              </div>
            </div>

            <div className="hf-habits-search">
              <label className="hf-habits-search-label">Buscar hábito</label>
              <input
                type="text"
                placeholder="Digite o nome do hábito..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="hf-habits-search-input"
              />
            </div>
          </div>
        </Card>

        <Card>
          {loading ? (
            <p className="hf-habits-empty">Carregando hábitos...</p>
          ) : (
            <>
              <div className="hf-habits-table-header">
                <span>Nome</span>
                <span>Frequência</span>
                <span>Hoje</span>
                <span>Streak</span>
                <span className="hf-actions">Ações</span>
              </div>

              {filteredHabits.map((habit) => (
                <div key={habit.id} className="hf-habits-row">
                  <span>
                    <Link href={`/app/habits/${habit.id}`} className="hf-habit-link">
                      <span className="hf-habit-link-text">{habit.name}</span>
                    </Link>
                  </span>

                  <span>{habit.freq}</span>
                  <span>{habit.today ? "✅" : "❌"}</span>
                  <span>{habit.streak}</span>
                  <div className="hf-habit-actions">
                    <button
                      type="button"
                      onClick={() => handleToggleToday(habit.id)}
                      className={`hf-habit-toggle ${habit.today ? "is-done" : ""}`}
                    >
                      {habit.today ? "Desmarcar" : "Marcar hoje"}
                    </button>
                  </div>
                </div>
              ))}

              {filteredHabits.length === 0 && !loading && (
                <p className="hf-habits-empty">
                  Nenhum hábito encontrado com os filtros atuais.
                </p>
              )}
            </>
          )}
        </Card>
      </section>
    </LayoutContainer>
  );
}
