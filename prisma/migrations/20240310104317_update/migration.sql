/*
  Warnings:

  - You are about to drop the `batter_statistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pitcher_statistics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "batter_statistics" DROP CONSTRAINT "batter_statistics_mlbAthleteStatisticId_fkey";

-- DropForeignKey
ALTER TABLE "pitcher_statistics" DROP CONSTRAINT "pitcher_statistics_mlbAthleteStatisticId_fkey";

-- DropTable
DROP TABLE "batter_statistics";

-- DropTable
DROP TABLE "pitcher_statistics";

-- CreateTable
CREATE TABLE "batting_statistics" (
    "id" TEXT NOT NULL,
    "at_bats" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "rbi" INTEGER NOT NULL,
    "home_runs" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "pitches_seen" INTEGER NOT NULL,
    "batting_average" DOUBLE PRECISION NOT NULL,
    "on_base_percentage" DOUBLE PRECISION NOT NULL,
    "slugging_percentage" DOUBLE PRECISION NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,
    "mlbAthleteStatisticId" TEXT,

    CONSTRAINT "batting_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitching_statistics" (
    "id" TEXT NOT NULL,
    "innings_pitched" DOUBLE PRECISION NOT NULL,
    "hits_allowed" INTEGER NOT NULL,
    "runs_allowed" INTEGER NOT NULL,
    "earned_runs" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "home_runs_allowed" INTEGER NOT NULL,
    "strikes" INTEGER NOT NULL,
    "era" DOUBLE PRECISION NOT NULL,
    "pitches_thrown" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,
    "mlbAthleteStatisticId" TEXT,

    CONSTRAINT "pitching_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batting_statistics_game_id_team_id_key" ON "batting_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "batting_statistics_game_id_athlete_id_key" ON "batting_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "pitching_statistics_game_id_team_id_key" ON "pitching_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "pitching_statistics_game_id_athlete_id_key" ON "pitching_statistics"("game_id", "athlete_id");

-- AddForeignKey
ALTER TABLE "batting_statistics" ADD CONSTRAINT "batting_statistics_mlbAthleteStatisticId_fkey" FOREIGN KEY ("mlbAthleteStatisticId") REFERENCES "mlb_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitching_statistics" ADD CONSTRAINT "pitching_statistics_mlbAthleteStatisticId_fkey" FOREIGN KEY ("mlbAthleteStatisticId") REFERENCES "mlb_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
