// src/services/habitsService.js
import { baseHabits } from '@/lib/habitsData';

// por enquanto vamos simular um "banco" em memória
let habitsDb = [...baseHabits];

function fakeDelay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// GET /habits
export async function listHabits() {
  await fakeDelay();
  return [...habitsDb];
}

// POST /habits
export async function createHabit(data) {
  await fakeDelay();

  const newHabit = {
    id: String(Date.now()),
    name: data.name,
    description: data.description || '',
    frequency: data.frequency || 'DAILY',
    frequencyLabel: data.frequencyLabel || 'Todos os dias',
    baseStreak: 0,
    // qualquer outro campo que você já use em baseHabits
  };

  habitsDb = [...habitsDb, newHabit];
  return newHabit;
}

// POST /habits/:id/toggle-today
export async function toggleHabitToday(id) {
  await fakeDelay();

  habitsDb = habitsDb.map((habit) => {
    if (String(habit.id) !== String(id)) return habit;
    const doneToday = !habit.doneToday;
    const baseStreak = doneToday
      ? (habit.baseStreak || 0) + 1
      : Math.max((habit.baseStreak || 1) - 1, 0);

    return {
      ...habit,
      doneToday,
      baseStreak
    };
  });

  const updated = habitsDb.find((h) => String(h.id) === String(id));
  return updated;
}
