/*
  Warnings:

  - You are about to drop the `DefensiveStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FumbleStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterceptionStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KickReturnStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KickingStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PassingStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PuntReturnStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PuntingStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReceivingStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RushingStatistics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_defensive_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_fumble_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_interception_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_kick_return_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_kicking_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_passing_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_punt_return_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_punting_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_receiving_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_rushing_statistics_id_fkey";

-- DropTable
DROP TABLE "DefensiveStatistics";

-- DropTable
DROP TABLE "FumbleStatistics";

-- DropTable
DROP TABLE "InterceptionStatistics";

-- DropTable
DROP TABLE "KickReturnStatistics";

-- DropTable
DROP TABLE "KickingStatistics";

-- DropTable
DROP TABLE "PassingStatistics";

-- DropTable
DROP TABLE "PuntReturnStatistics";

-- DropTable
DROP TABLE "PuntingStatistics";

-- DropTable
DROP TABLE "ReceivingStatistics";

-- DropTable
DROP TABLE "RushingStatistics";

-- CreateTable
CREATE TABLE "passing_statistics" (
    "id" TEXT NOT NULL,
    "completions" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_attempt" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "sacks" INTEGER NOT NULL,
    "sack_yards_lost" INTEGER NOT NULL,
    "adjusted_rating" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "passing_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rushing_statistics" (
    "id" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_attempt" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "rushing_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receiving_statistics" (
    "id" TEXT NOT NULL,
    "receptions" INTEGER NOT NULL,
    "targets" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_reception" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "receiving_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fumble_statistics" (
    "id" TEXT NOT NULL,
    "fumbles" INTEGER NOT NULL,
    "lost" INTEGER NOT NULL,
    "recovered" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "fumble_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defensive_statistics" (
    "id" TEXT NOT NULL,
    "total_tackles" INTEGER NOT NULL,
    "solo_tackles" INTEGER NOT NULL,
    "sacks" DOUBLE PRECISION NOT NULL,
    "tackles_for_loss" DOUBLE PRECISION NOT NULL,
    "passes_defended" INTEGER NOT NULL,
    "qb_hits" INTEGER NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "defensive_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interception_statistics" (
    "id" TEXT NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "interception_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kick_return_statistics" (
    "id" TEXT NOT NULL,
    "returns" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_return" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "kick_return_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "punt_return_statistics" (
    "id" TEXT NOT NULL,
    "returns" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_return" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "punt_return_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kicking_statistics" (
    "id" TEXT NOT NULL,
    "field_goal_attempts" INTEGER NOT NULL,
    "field_goal_made" INTEGER NOT NULL,
    "field_goal_pct" DOUBLE PRECISION NOT NULL,
    "longest" INTEGER NOT NULL,
    "extra_point_attempts" INTEGER NOT NULL,
    "extra_point_made" INTEGER NOT NULL,
    "total_points" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "kicking_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "punting_statistics" (
    "id" TEXT NOT NULL,
    "punts" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_punt" DOUBLE PRECISION NOT NULL,
    "longest" INTEGER NOT NULL,
    "punts_inside_20" INTEGER NOT NULL,
    "touchbacks" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "punting_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "passing_statistics_game_id_team_id_key" ON "passing_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "passing_statistics_game_id_athlete_id_key" ON "passing_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "rushing_statistics_game_id_team_id_key" ON "rushing_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "rushing_statistics_game_id_athlete_id_key" ON "rushing_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "receiving_statistics_game_id_team_id_key" ON "receiving_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "receiving_statistics_game_id_athlete_id_key" ON "receiving_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fumble_statistics_game_id_team_id_key" ON "fumble_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "fumble_statistics_game_id_athlete_id_key" ON "fumble_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "defensive_statistics_game_id_team_id_key" ON "defensive_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "defensive_statistics_game_id_athlete_id_key" ON "defensive_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "interception_statistics_game_id_team_id_key" ON "interception_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "interception_statistics_game_id_athlete_id_key" ON "interception_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "kick_return_statistics_game_id_team_id_key" ON "kick_return_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "kick_return_statistics_game_id_athlete_id_key" ON "kick_return_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "punt_return_statistics_game_id_team_id_key" ON "punt_return_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "punt_return_statistics_game_id_athlete_id_key" ON "punt_return_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "kicking_statistics_game_id_team_id_key" ON "kicking_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "kicking_statistics_game_id_athlete_id_key" ON "kicking_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "punting_statistics_game_id_team_id_key" ON "punting_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "punting_statistics_game_id_athlete_id_key" ON "punting_statistics"("game_id", "athlete_id");

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_passing_statistics_id_fkey" FOREIGN KEY ("passing_statistics_id") REFERENCES "passing_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_rushing_statistics_id_fkey" FOREIGN KEY ("rushing_statistics_id") REFERENCES "rushing_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_receiving_statistics_id_fkey" FOREIGN KEY ("receiving_statistics_id") REFERENCES "receiving_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_fumble_statistics_id_fkey" FOREIGN KEY ("fumble_statistics_id") REFERENCES "fumble_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_defensive_statistics_id_fkey" FOREIGN KEY ("defensive_statistics_id") REFERENCES "defensive_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_interception_statistics_id_fkey" FOREIGN KEY ("interception_statistics_id") REFERENCES "interception_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_kick_return_statistics_id_fkey" FOREIGN KEY ("kick_return_statistics_id") REFERENCES "kick_return_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_punt_return_statistics_id_fkey" FOREIGN KEY ("punt_return_statistics_id") REFERENCES "punt_return_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_kicking_statistics_id_fkey" FOREIGN KEY ("kicking_statistics_id") REFERENCES "kicking_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_punting_statistics_id_fkey" FOREIGN KEY ("punting_statistics_id") REFERENCES "punting_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
