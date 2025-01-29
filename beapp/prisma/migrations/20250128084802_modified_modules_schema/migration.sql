/*
  Warnings:

  - You are about to drop the column `userStudyProgressId` on the `Modules` table. All the data in the column will be lost.
  - Added the required column `moduleNumber` to the `Modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectName` to the `Modules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Modules" DROP CONSTRAINT "Modules_userStudyProgressId_fkey";

-- DropIndex
DROP INDEX "Modules_userStudyProgressId_key";

-- AlterTable
ALTER TABLE "Modules" DROP COLUMN "userStudyProgressId",
ADD COLUMN     "moduleNumber" INTEGER NOT NULL,
ADD COLUMN     "subjectName" TEXT NOT NULL,
ALTER COLUMN "moduleName" SET NOT NULL,
ALTER COLUMN "moduleName" SET DATA TYPE TEXT,
ALTER COLUMN "moduleDescription" SET NOT NULL,
ALTER COLUMN "moduleDescription" SET DATA TYPE TEXT;
