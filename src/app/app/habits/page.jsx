'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/Card';
import LayoutContainer from '@/components/LayoutContainer';
import Button from '@/components/Button';
import Link from 'next/link';
import { colors, spacing, radius } from '@/lib/designSystem';

const initialHabits = [
  { id: '1', name: 'Ler 10 páginas', freq: 'Diário', today: false, streak: '3 dias' },
  { id: '2', name: 'Beber 2L de água', freq: 'Seg–Sex', today: false, streak: '7 dias' },
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
      <section style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
        {/* Cabeçalho */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: spacing.lg
          }}
        >
          <div>
            <h1 style={{ fontSize: 24 }}>Seus hábitos</h1>
            <p style={{ fontSize: 14, color: colors.textMuted }}>
              Liste, filtre e acompanhe todos os seus hábitos diários. Clique no nome do
              hábito para ver mais detalhes.
            </p>
          </div>
          <Link href="/app/habits/new">
            <Button>+ Adicionar hábito</Button>
          </Link>
        </div>

        {/* Barra de filtros + contadores */}
        <Card style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: spacing.lg,
              flexWrap: 'wrap'
            }}
          >
            <div style={{ fontSize: 13, color: colors.textMuted }}>
              <strong>{activeCount}</strong> hábitos ativos ·{' '}
              <strong>{doneTodayCount}</strong> concluídos hoje
            </div>

            <div
              style={{
                display: 'flex',
                gap: spacing.sm
              }}
            >
              <button
                type="button"
                onClick={() => setFilter('all')}
                style={{
                  padding: `${spacing.xs}px ${spacing.md}px`,
                  borderRadius: radius.pill,
                  border: 'none',
                  fontSize: 13,
                  cursor: 'pointer',
                  backgroundColor:
                    filter === 'all' ? colors.primary : colors.primarySoft,
                  color: filter === 'all' ? '#FFFFFF' : colors.primary
                }}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFilter('done')}
                style={{
                  padding: `${spacing.xs}px ${spacing.md}px`,
                  borderRadius: radius.pill,
                  border: 'none',
                  fontSize: 13,
                  cursor: 'pointer',
                  backgroundColor:
                    filter === 'done' ? colors.primary : colors.primarySoft,
                  color: filter === 'done' ? '#FFFFFF' : colors.primary
                }}
              >
                Concluídos hoje
              </button>
              <button
                type="button"
                onClick={() => setFilter('pending')}
                style={{
                  padding: `${spacing.xs}px ${spacing.md}px`,
                  borderRadius: radius.pill,
                  border: 'none',
                  fontSize: 13,
                  cursor: 'pointer',
                  backgroundColor:
                    filter === 'pending' ? colors.primary : colors.primarySoft,
                  color: filter === 'pending' ? '#FFFFFF' : colors.primary
                }}
              >
                Pendentes
              </button>
            </div>
          </div>

          {/* Busca */}
          <div style={{ marginTop: spacing.sm }}>
            <label
              style={{
                fontSize: 13,
                color: colors.textMuted,
                display: 'block',
                marginBottom: 4
              }}
            >
              Buscar hábito
            </label>
            <input
              type="text"
              placeholder="Digite o nome do hábito..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: `${spacing.sm}px ${spacing.md}px`,
                borderRadius: radius.md,
                border: `1px solid ${colors.border}`,
                fontSize: 14
              }}
            />
          </div>
        </Card>

        {/* Tabela de hábitos */}
        <Card>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 0.6fr 0.8fr 1fr',
              gap: spacing.sm,
              fontSize: 14,
              paddingBottom: spacing.sm,
              borderBottom: `1px solid ${colors.border}`,
              marginBottom: spacing.sm
            }}
          >
            <span style={{ fontWeight: 600 }}>Nome</span>
            <span style={{ fontWeight: 600 }}>Frequência</span>
            <span style={{ fontWeight: 600 }}>Hoje</span>
            <span style={{ fontWeight: 600 }}>Streak</span>
            <span style={{ fontWeight: 600, textAlign: 'right' }}>Ações</span>
          </div>

          {filteredHabits.map((habit) => (
            <div
              key={habit.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 0.6fr 0.8fr 1fr',
                gap: spacing.sm,
                padding: `${spacing.sm}px 0`,
                fontSize: 14,
                borderBottom: `1px solid ${colors.border}`,
                alignItems: 'center'
              }}
            >
              {/* AQUI é a única mudança: nome clicável */}
              <span>
                <Link
                  href={`/app/habits/${habit.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <span
                    style={{
                      borderBottom: '1px solid transparent',
                      paddingBottom: 2
                    }}
                  >
                    {habit.name}
                  </span>
                </Link>
              </span>

              <span>{habit.freq}</span>
              <span>{habit.today ? '✔' : '—'}</span>
              <span>{habit.streak}</span>
              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => toggleToday(habit.id)}
                  style={{
                    borderRadius: 999,
                    border: `1px solid ${
                      habit.today ? colors.success : colors.primary
                    }`,
                    padding: `${spacing.xs}px ${spacing.md}px`,
                    backgroundColor: habit.today ? colors.success : 'transparent',
                    color: habit.today ? '#FFFFFF' : colors.primary,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  {habit.today ? 'Desmarcar' : 'Marcar hoje'}
                </button>
              </div>
            </div>
          ))}

          {filteredHabits.length === 0 && (
            <p style={{ fontSize: 14, color: colors.textMuted, marginTop: spacing.md }}>
              Nenhum hábito encontrado com os filtros atuais.
            </p>
          )}
        </Card>
      </section>
    </LayoutContainer>
  );
}


