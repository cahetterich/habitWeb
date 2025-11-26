// src/app/api/habits/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { start, end };
}

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

// GET /api/habits
export async function GET() {
  const user = await getDemoUser();

  const habits = await prisma.habit.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "asc" },
  });

  if (!habits.length) {
    return NextResponse.json([]);
  }

  const { start, end } = getTodayRange();

  const completions = await prisma.habitCompletion.findMany({
    where: {
      habitId: { in: habits.map((h) => h.id) },
      date: { gte: start, lt: end },
    },
  });

  const doneSet = new Set(completions.map((c) => c.habitId));

  const payload = habits.map((h) => ({
    ...h,
    doneToday: doneSet.has(h.id),
  }));

  return NextResponse.json(payload);
}

// POST /api/habits
export async function POST(request) {
  const body = await request.json();
  const { name, description, frequency, frequencyLabel } = body;

  if (!name || !frequency) {
    return NextResponse.json(
      { error: "Nome e frequência são obrigatórios." },
      { status: 400 }
    );
  }

  const user = await getDemoUser();

  const habit = await prisma.habit.create({
    data: {
      name,
      description: description || "",
      frequency,
      frequencyLabel: frequencyLabel || "Todos os dias",
      ownerId: user.id,
    },
  });

  return NextResponse.json(habit, { status: 201 });
}
