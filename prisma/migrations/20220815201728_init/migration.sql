-- CreateTable
CREATE TABLE "leagues" (
    "id" TEXT NOT NULL,
    "depthChartUrl" TEXT NOT NULL,
    "rosterUrl" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abr" TEXT NOT NULL,
    "imgSrc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "depthChartUr" TEXT NOT NULL,
    "rosterUr" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abr" TEXT NOT NULL,
    "imgSrc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "injuryStatus" TEXT NOT NULL,
    "pos" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "positionGroup" TEXT NOT NULL,
    "wrSet" INTEGER NOT NULL,
    "playerUrl" TEXT NOT NULL,
    "playerImageSrc" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "playerDepthPosition" TEXT[],
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leagueId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FantasyProsData" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "playerNmae" TEXT NOT NULL,
    "pos" TEXT NOT NULL,
    "byeWeek" INTEGER NOT NULL,
    "strengthOgSchedule" TEXT NOT NULL,
    "avgAdp" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "fantasyProsStatsId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FantasyProsStats" (
    "id" TEXT NOT NULL,
    "typ" TEXT NOT NULL,
    "fanPoints" DOUBLE PRECISION NOT NULL,
    "passingYds" DOUBLE PRECISION NOT NULL,
    "passingTds" DOUBLE PRECISION NOT NULL,
    "receivingRec" DOUBLE PRECISION NOT NULL,
    "receivingYds" DOUBLE PRECISION NOT NULL,
    "receivingTds" DOUBLE PRECISION NOT NULL,
    "russhingAtt" DOUBLE PRECISION NOT NULL,
    "rushiingYds" DOUBLE PRECISION NOT NULL,
    "rushingTds" DOUBLE PRECISION NOT NULL,
    "fantasyProsDataId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FantasyProsData.playerId_unique" ON "FantasyProsData"("playerId");

-- AddForeignKey
ALTER TABLE "teams" ADD FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FantasyProsData" ADD FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FantasyProsStats" ADD FOREIGN KEY ("fantasyProsDataId") REFERENCES "FantasyProsData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
