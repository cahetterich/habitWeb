/*
  Warnings:

  - You are about to drop the `Habit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HabitCompletion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Habit" DROP CONSTRAINT "Habit_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "HabitCompletion" DROP CONSTRAINT "HabitCompletion_habitId_fkey";

-- DropTable
DROP TABLE "Habit";

-- DropTable
DROP TABLE "HabitCompletion";

-- DropTable
DROP TABLE "User";
