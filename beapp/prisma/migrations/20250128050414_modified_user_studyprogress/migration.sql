/*
  Warnings:

  - Changed the type of `programmingLanguages` on the `UserStudyProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Courses" AS ENUM ('JAVASCRIPT', 'PYTHON', 'REACTJS');

-- AlterTable
ALTER TABLE "UserStudyProfile" DROP COLUMN "programmingLanguages",
ADD COLUMN     "programmingLanguages" "Courses" NOT NULL;
