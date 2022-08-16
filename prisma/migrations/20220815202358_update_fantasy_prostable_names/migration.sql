/*
  Warnings:

  - You are about to drop the `FantasyProsData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FantasyProsStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FantasyProsData" DROP CONSTRAINT "FantasyProsData_playerId_fkey";

-- DropForeignKey
ALTER TABLE "FantasyProsStats" DROP CONSTRAINT "FantasyProsStats_fantasyProsDataId_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_teamId_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_leagueId_fkey";

-- DropTable
DROP TABLE "FantasyProsData";

-- DropTable
DROP TABLE "FantasyProsStats";

-- CreateTable
CREATE TABLE "fantasy_pros_data" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fantasy_pros_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fantasy_pros_stats" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fantasy_pros_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fantasy_pros_data_playerId_key" ON "fantasy_pros_data"("playerId");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fantasy_pros_data" ADD CONSTRAINT "fantasy_pros_data_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fantasy_pros_stats" ADD CONSTRAINT "fantasy_pros_stats_fantasyProsDataId_fkey" FOREIGN KEY ("fantasyProsDataId") REFERENCES "fantasy_pros_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
