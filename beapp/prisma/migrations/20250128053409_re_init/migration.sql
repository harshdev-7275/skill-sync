/*
  Warnings:

  - You are about to drop the column `currentTopic` on the `UserStudyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `lastSession` on the `UserStudyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `UserStudyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `nextMilestone` on the `UserStudyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `programmingLanguages` on the `UserStudyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserStudyProgress` table. All the data in the column will be lost.
  - You are about to drop the column `userStudyProfileId` on the `UserStudyProgress` table. All the data in the column will be lost.
  - Added the required column `currentModule` to the `UserStudyProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastCompletedModule` to the `UserStudyProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upcomingModule` to the `UserStudyProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserStudyProgress" DROP CONSTRAINT "UserStudyProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserStudyProgress" DROP CONSTRAINT "UserStudyProgress_userStudyProfileId_fkey";

-- DropIndex
DROP INDEX "UserStudyProgress_userId_key";

-- AlterTable
ALTER TABLE "UserStudyProgress" DROP COLUMN "currentTopic",
DROP COLUMN "lastSession",
DROP COLUMN "level",
DROP COLUMN "nextMilestone",
DROP COLUMN "programmingLanguages",
DROP COLUMN "userId",
DROP COLUMN "userStudyProfileId",
ADD COLUMN     "currentModule" TEXT NOT NULL,
ADD COLUMN     "lastCompletedModule" TEXT NOT NULL,
ADD COLUMN     "upcomingModule" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Modules" (
    "id" SERIAL NOT NULL,
    "moduleName" TEXT NOT NULL,
    "moduleDescription" TEXT NOT NULL,
    "userStudyProgressId" TEXT NOT NULL,

    CONSTRAINT "Modules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Modules" ADD CONSTRAINT "Modules_userStudyProgressId_fkey" FOREIGN KEY ("userStudyProgressId") REFERENCES "UserStudyProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
