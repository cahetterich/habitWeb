'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/Card';
import LayoutContainer from '@/components/LayoutContainer';
import Button from '@/components/Button';
import Link from 'next/link';
import { spacing } from '@/lib/designSystem';
import '@/styles/habits.css';

const initialHabits = [
  { id: '1', name: 'Ler 10 páginas', freq: 'Diário', today: false, streak: '3 dias' },
  { id: '2', name: 'Beber 2L de água', freq: 'Seg à Sex', today: false, streak: '7 dias' },
  { id: '3', name: 'Estudar 30min', freq: 'Diário', today: false, streak: '1 dia' }
];

export default function HabitsPage() {
  const [habits, setHabits] = useState(initialHabits);
  const [filter, setFilter] = useState('all'); // all | done | pending
  const [search, setSearch] = useState('');

  const activeCount = habits.length;
  const doneTodayCount = habits.filter((h) => h.today).length;

  function toggleToday(id) {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, today: !habit.today } : habit
      )
    );
  }

  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (search && !habit.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (filter === 'done') return habit.today;
      if (filter === 'pending') return !habit.today;
      return true; // all
    });
  }, [habits, filter, search]);

  return (
    <LayoutContainer>
      <section className="hf-habits-section">
        {/* Cabeçalho */}
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

        {/* Barra de filtros + contadores */}
        <Card style={{ padding: spacing.md }}>
          <div className="hf-habits-filter-card">
            <div className="hf-habits-filter-row">
              <div className="hf-habits-stats">
                <strong>{activeCount}</strong> hábitos ativos •{' '}
                <strong>{doneTodayCount}</strong> concluídos hoje
              </div>

              <div className="hf-habits-filter-actions">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`hf-filter-pill ${filter === 'all' ? 'is-active' : ''}`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('done')}
                  className={`hf-filter-pill ${filter === 'done' ? 'is-active' : ''}`}
                >
                  Concluídos hoje
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('pending')}
                  className={`hf-filter-pill ${filter === 'pending' ? 'is-active' : ''}`}
                >
                  Pendentes
                </button>
              </div>
            </div>

            {/* Busca */}
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

        {/* Tabela de hábitos */}
        <Card>
          <div className="hf-habits-table-header">
            <span>Nome</span>
            <span>Frequência</span>
            <span>Hoje</span>
            <span>Streak</span>
            <span className="hf-actions">Ações</span>
          </div>

          {filteredHabits.map((habit) => (
            <div key={habit.id} className="hf-habits-row">
              {/* AQUI fica a única mudança: nome clicável */}
              <span>
                <Link href={`/app/habits/${habit.id}`} className="hf-habit-link">
                  <span className="hf-habit-link-text">{habit.name}</span>
                </Link>
              </span>

              <span>{habit.freq}</span>
              <span>{habit.today ? '✅' : '❌'}</span>
              <span>{habit.streak}</span>
              <div className="hf-habit-actions">
                <button
                  type="button"
                  onClick={() => toggleToday(habit.id)}
                  className={`hf-habit-toggle ${habit.today ? 'is-done' : ''}`}
                >
                  {habit.today ? 'Desmarcar' : 'Marcar hoje'}
                </button>
              </div>
            </div>
          ))}

          {filteredHabits.length === 0 && (
            <p className="hf-habits-empty">
              Nenhum hábito encontrado com os filtros atuais.
            </p>
          )}
        </Card>
      </section>
    </LayoutContainer>
  );
}
