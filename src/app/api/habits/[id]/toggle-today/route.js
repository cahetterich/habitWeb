// src/app/api/habits/[id]/toggle-today/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function getDemoUser() {
  let user = await prisma.user.findFirst({
    where: { email: "demo@habitflow.local" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        firstName: "Usuário",
        lastName: "Demo",
        email: "demo@habitflow.local",
        passwordHash: "stub",
      },
    });
  }

  return user;
}

function getDayRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return { start, end };
}

export async function POST(_req, { params }) {
  const user = await getDemoUser();

  const habit = await prisma.habit.findFirst({
    where: { id: params.id, ownerId: user.id },
  });

  if (!habit) {
    return NextResponse.json(
      { error: "Hábito não encontrado." },
      { status: 404 }
    );
  }

  const { start, end } = getDayRange();

  // existe completion para hoje?
  const existing = await prisma.habitCompletion.findFirst({
    where: {
      habitId: habit.id,
      date: {
        gte: start,
        lt: end,
      },
    },
  });

  if (existing) {
    // desmarcar hoje
    await prisma.habitCompletion.delete({
      where: { id: existing.id },
    });
  } else {
    // marcar hoje
    await prisma.habitCompletion.create({
      data: {
        habitId: habit.id,
        date: new Date(),
        done: true,
      },
    });
  }

  // pega TODOS os dias com completion desse hábito
  const allCompletions = await prisma.habitCompletion.findMany({
    where: { habitId: habit.id },
    orderBy: { date: "asc" },
  });

  const dayKeys = Array.from(
    new Set(allCompletions.map((c) => c.date.toISOString().slice(0, 10)))
  ).sort(); // "2025-11-26" etc.

  // calcula maior streak histórico
  let bestStreak = 0;
  let currentStreak = 0;
  let prevDate = null;

  for (const key of dayKeys) {
    const [y, m, d] = key.split("-").map((s) => parseInt(s, 10));
    const cur = new Date(y, m - 1, d);

    if (prevDate) {
      const diffMs = cur.getTime() - prevDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    if (currentStreak > bestStreak) bestStreak = currentStreak;
    prevDate = cur;
  }

  // streak atual (sequência que termina HOJE, se hoje tiver completion)
  const todayKey = new Date().toISOString().slice(0, 10);
  let streak = 0;

  if (dayKeys.includes(todayKey)) {
    streak = 1;
    let idx = dayKeys.indexOf(todayKey);
    while (idx > 0) {
      const cur = new Date(dayKeys[idx]);
      const prev = new Date(dayKeys[idx - 1]);
      const diffMs = cur.getTime() - prev.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        streak += 1;
        idx -= 1;
      } else {
        break;
      }
    }
  }

  const updatedHabit = await prisma.habit.update({
    where: { id: habit.id },
    data: {
      streak,
      bestStreak,
    },
  });

  const doneToday = !existing; // se não tinha, agora tem; se tinha, foi removido

  return NextResponse.json({
    ...updatedHabit,
    doneToday,
  });
}

