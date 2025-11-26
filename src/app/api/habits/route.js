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
  const { start, end } = getTodayRange();

  const habits = await prisma.habit.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "asc" },
    include: {
      completions: {
        where: {
          date: {
            gte: start,
            lt: end,
          },
        },
        select: { id: true },
      },
    },
  });

  const result = habits.map((h) => ({
    id: h.id,
    name: h.name,
    description: h.description,
    frequency: h.frequency,
    frequencyLabel: h.frequencyLabel,
    streak: h.streak,
    bestStreak: h.bestStreak,
    createdAt: h.createdAt,
    updatedAt: h.updatedAt,
    doneToday: h.completions.length > 0,
  }));

  return NextResponse.json(result);
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

  // devolve já num formato parecido com o GET
  return NextResponse.json(
    {
      ...habit,
      doneToday: false,
    },
    { status: 201 }
  );
}
