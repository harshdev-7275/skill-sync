/*
  Warnings:

  - You are about to drop the `CheckPoint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LearningTrack` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('beginner', 'intermediate', 'advanced');

-- DropForeignKey
ALTER TABLE "CheckPoint" DROP CONSTRAINT "CheckPoint_trackId_fkey";

-- DropForeignKey
ALTER TABLE "LearningTrack" DROP CONSTRAINT "LearningTrack_userId_fkey";

-- DropTable
DROP TABLE "CheckPoint";

-- DropTable
DROP TABLE "LearningTrack";

-- CreateTable
CREATE TABLE "StudyProfile" (
    "id" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "languages" TEXT[],
    "level" "Level" NOT NULL DEFAULT 'beginner',
    "userId" TEXT NOT NULL,

    CONSTRAINT "StudyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyProfile_userId_key" ON "StudyProfile"("userId");

-- AddForeignKey
ALTER TABLE "StudyProfile" ADD CONSTRAINT "StudyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
