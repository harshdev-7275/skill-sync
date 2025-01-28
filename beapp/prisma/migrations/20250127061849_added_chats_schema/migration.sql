/*
  Warnings:

  - The values [beginner,intermediate,advanced] on the enum `Level` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'BOT');

-- AlterEnum
BEGIN;
CREATE TYPE "Level_new" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCE');
ALTER TABLE "StudyProfile" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "StudyProfile" ALTER COLUMN "level" TYPE "Level_new" USING ("level"::text::"Level_new");
ALTER TYPE "Level" RENAME TO "Level_old";
ALTER TYPE "Level_new" RENAME TO "Level";
DROP TYPE "Level_old";
ALTER TABLE "StudyProfile" ALTER COLUMN "level" SET DEFAULT 'BEGINNER';
COMMIT;

-- AlterTable
ALTER TABLE "StudyProfile" ALTER COLUMN "level" SET DEFAULT 'BEGINNER';

-- CreateTable
CREATE TABLE "Chats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messages" TEXT[],
    "role" "Role" NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
