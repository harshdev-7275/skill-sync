/*
  Warnings:

  - You are about to drop the `StudyProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudyProfile" DROP CONSTRAINT "StudyProfile_userId_fkey";

-- DropTable
DROP TABLE "StudyProfile";

-- CreateTable
CREATE TABLE "UserStudyProfile" (
    "id" TEXT NOT NULL,
    "programmingLanguages" TEXT NOT NULL,
    "level" "Level" NOT NULL DEFAULT 'BEGINNER',
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserStudyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStudyProgress" (
    "id" TEXT NOT NULL,
    "programmingLanguages" TEXT NOT NULL,
    "level" "Level" NOT NULL DEFAULT 'BEGINNER',
    "lastSession" TEXT NOT NULL,
    "completedModules" TEXT[],
    "currentTopic" TEXT NOT NULL,
    "nextMilestone" TEXT NOT NULL,
    "userStudyProfileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserStudyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStudyProfile_userId_key" ON "UserStudyProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStudyProgress_userId_key" ON "UserStudyProgress"("userId");

-- AddForeignKey
ALTER TABLE "UserStudyProfile" ADD CONSTRAINT "UserStudyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudyProgress" ADD CONSTRAINT "UserStudyProgress_userStudyProfileId_fkey" FOREIGN KEY ("userStudyProfileId") REFERENCES "UserStudyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudyProgress" ADD CONSTRAINT "UserStudyProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
