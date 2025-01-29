/*
  Warnings:

  - The `moduleName` column on the `Modules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `moduleDescription` column on the `Modules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userStudyProgressId]` on the table `Modules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userStudyProfileId` to the `UserStudyProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Modules" DROP COLUMN "moduleName",
ADD COLUMN     "moduleName" TEXT[],
DROP COLUMN "moduleDescription",
ADD COLUMN     "moduleDescription" TEXT[];

-- AlterTable
ALTER TABLE "UserStudyProgress" ADD COLUMN     "userStudyProfileId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Modules_userStudyProgressId_key" ON "Modules"("userStudyProgressId");

-- AddForeignKey
ALTER TABLE "UserStudyProgress" ADD CONSTRAINT "UserStudyProgress_userStudyProfileId_fkey" FOREIGN KEY ("userStudyProfileId") REFERENCES "UserStudyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
