// src/app/api/me/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// mesmo esquema do getDemoUser das rotas de hábitos
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

// GET /api/me
export async function GET() {
  const user = await getDemoUser();

  return NextResponse.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
}
