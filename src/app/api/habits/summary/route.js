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

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export async function GET() {
  const user = await getDemoUser();

  const habits = await prisma.habit.findMany({
    where: { ownerId: user.id },
    select: { id: true },
  });

  const habitIds = habits.map((h) => h.id);
  const totalHabits = habitIds.length;

  const today = startOfDay(new Date());
  const result = [];

  // se não tiver hábito, devolve 7 dias zerados
  if (totalHabits === 0) {
    for (let offset = 6; offset >= 0; offset--) {
      const d = new Date(today);
      d.setDate(d.getDate() - offset);
      const key = d.toISOString().slice(0, 10);

      result.push({
        date: key,
        weekday: WEEKDAYS[d.getDay()],
        completed: 0,
        totalHabits: 0,
        completionRate: 0,
      });
    }
    return NextResponse.json(result);
  }

  const start = new Date(today);
  start.setDate(start.getDate() - 6);

  const end = new Date(today);
  end.setDate(end.getDate() + 1);

  const completions = await prisma.habitCompletion.findMany({
    where: {
      habitId: { in: habitIds },
      date: {
        gte: start,
        lt: end,
      },
    },
  });

  const byDay = {};
  for (const c of completions) {
    const key = c.date.toISOString().slice(0, 10);
    if (!byDay[key]) byDay[key] = new Set();
    byDay[key].add(c.habitId);
  }

  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    const key = d.toISOString().slice(0, 10);

    const completedSet = byDay[key] || new Set();
    const completed = completedSet.size;
    const completionRate =
      totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;

    result.push({
      date: key,
      weekday: WEEKDAYS[d.getDay()],
      completed,
      totalHabits,
      completionRate,
    });
  }

  return NextResponse.json(result);
}
