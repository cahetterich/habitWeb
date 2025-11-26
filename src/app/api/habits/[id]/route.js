// src/app/api/habits/[id]/route.js
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
        firstName: "Carla",
        lastName: "Demo",
        email: "demo@habitflow.local",
        passwordHash: "stub",
      },
    });
  }

  return user;
}

// GET /api/habits/:id
export async function GET(_req, { params }) {
  const user = await getDemoUser();

  const habit = await prisma.habit.findFirst({
    where: { id: params.id, ownerId: user.id },
  });

  if (!habit) {
    return NextResponse.json({ error: "Hábito não encontrado." }, { status: 404 });
  }

  const { start, end } = getTodayRange();
  const completion = await prisma.habitCompletion.findFirst({
    where: { habitId: habit.id, date: { gte: start, lt: end } },
  });

  return NextResponse.json({
    ...habit,
    doneToday: !!completion,
  });
}

// PATCH /api/habits/:id
export async function PATCH(req, { params }) {
  const user = await getDemoUser();
  const body = await req.json();
  const { name, description, frequency, frequencyLabel } = body;

  try {
    const habit = await prisma.habit.update({
      where: { id: params.id, ownerId: user.id },
      data: {
        name,
        description,
        frequency,
        frequencyLabel,
      },
    });

    return NextResponse.json(habit);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível atualizar o hábito." },
      { status: 400 }
    );
  }
}

// DELETE /api/habits/:id
export async function DELETE(_req, { params }) {
  const user = await getDemoUser();

  await prisma.habitCompletion.deleteMany({
    where: { habitId: params.id },
  });

  try {
    await prisma.habit.delete({
      where: { id: params.id, ownerId: user.id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível excluir o hábito." },
      { status: 400 }
    );
  }
}

