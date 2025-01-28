-- CreateTable
CREATE TABLE "LearningTrack" (
    "id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LearningTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckPoint" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "moduleProgress" INTEGER NOT NULL DEFAULT 0,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckPoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LearningTrack" ADD CONSTRAINT "LearningTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckPoint" ADD CONSTRAINT "CheckPoint_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "LearningTrack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
