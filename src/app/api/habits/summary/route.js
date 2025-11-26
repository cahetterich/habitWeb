// src/app/api/habits/summary/route.js
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

function getDayRange(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return { start, end };
}

function getWeekdayLabel(date) {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date);
}

// GET /api/habits/summary
export async function GET() {
  const user = await getDemoUser();

  // todos os hábitos do usuário
  const habits = await prisma.habit.findMany({
    where: { ownerId: user.id },
    select: { id: true },
  });

  const totalHabits = habits.length;
  const habitIds = habits.map((h) => h.id);

  // se não tiver hábitos ainda, devolve 7 dias com tudo 0
  if (totalHabits === 0) {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      );
      const key = d.toISOString().slice(0, 10);

      days.push({
        date: key,
        weekday: getWeekdayLabel(d),
        completed: 0,
        totalHabits: 0,
        completionRate: 0,
      });
    }

    return NextResponse.json(days);
  }

  const today = new Date();
  const result = [];

  // últimos 7 dias (do mais antigo pro mais recente)
  for (let i = 6; i >= 0; i--) {
    const d = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - i
    );
    const key = d.toISOString().slice(0, 10);
    const { start, end } = getDayRange(d);

    const completions = await prisma.habitCompletion.findMany({
      where: {
        habitId: { in: habitIds },
        date: {
          gte: start,
          lt: end,
        },
      },
      select: { habitId: true },
    });

    // quantos hábitos diferentes foram concluídos nesse dia
    const uniqueHabits = new Set(completions.map((c) => c.habitId));
    const completed = uniqueHabits.size;

    const completionRate =
      totalHabits > 0
        ? Math.round((completed / totalHabits) * 100)
        : 0;

    result.push({
      date: key,
      weekday: getWeekdayLabel(d),
      completed,
      totalHabits,
      completionRate,
    });
  }

  return NextResponse.json(result);
}
