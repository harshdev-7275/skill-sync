/*
  Warnings:

  - Added the required column `level` to the `Modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Modules" ADD COLUMN     "level" TEXT NOT NULL;
