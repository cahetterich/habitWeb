// src/app/api/me/route.js
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

// GET /api/me
export async function GET() {
  const user = await getDemoUser();
  return NextResponse.json(user);
}

