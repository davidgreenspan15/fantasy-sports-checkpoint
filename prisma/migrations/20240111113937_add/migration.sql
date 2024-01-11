/*
  Warnings:

  - You are about to drop the column `fpsAthleteId` on the `athletes` table. All the data in the column will be lost.
  - You are about to drop the column `positionId` on the `athletes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[athlete_id]` on the table `fps_athletes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position_id` to the `athletes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `athlete_id` to the `fps_athletes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_fpsAthleteId_fkey";

-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_positionId_fkey";

-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "fpsAthleteId",
DROP COLUMN "positionId",
ADD COLUMN     "position_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "fps_athletes" ADD COLUMN     "athlete_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "team_game_statistics" (
    "id" TEXT NOT NULL,
    "team_game_id" TEXT NOT NULL,
    "nfl_statistic_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "team_game_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athlete_game_statistics" (
    "id" TEXT NOT NULL,
    "team_game_id" TEXT NOT NULL,
    "athlete_id" TEXT NOT NULL,
    "nfl_statistic_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "athlete_game_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfl_statistics" (
    "id" TEXT NOT NULL,
    "nfl_team_statistic_id" TEXT,

    CONSTRAINT "nfl_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfl_team_statistics" (
    "id" TEXT NOT NULL,
    "first_downs" INTEGER NOT NULL,
    "first_downs_passing" INTEGER NOT NULL,
    "first_downs_rushing" INTEGER NOT NULL,
    "first_downs_penalty" INTEGER NOT NULL,
    "third_down_eff" TEXT NOT NULL,
    "fourth_down_eff" TEXT NOT NULL,
    "total_offensive_plays" INTEGER NOT NULL,
    "total_yards" INTEGER NOT NULL,
    "yards_per_play" DOUBLE PRECISION NOT NULL,
    "total_drives" INTEGER NOT NULL,
    "net_passing_yards" INTEGER NOT NULL,
    "completions_attempts" TEXT NOT NULL,
    "yards_per_pass" DOUBLE PRECISION NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "sacks" INTEGER NOT NULL,
    "sack_yards" INTEGER NOT NULL,
    "rushing_attempts" INTEGER NOT NULL,
    "rushing_yards" INTEGER NOT NULL,
    "yards_per_rush_attempt" DOUBLE PRECISION NOT NULL,
    "red_zone_attempts" INTEGER NOT NULL,
    "red_zone_conversions" INTEGER NOT NULL,
    "total_penalties" INTEGER NOT NULL,
    "total_penalty_yards" INTEGER NOT NULL,
    "turnovers" INTEGER NOT NULL,
    "fumbles_lost" INTEGER NOT NULL,
    "interceptions_thrown" INTEGER NOT NULL,
    "defensive_tds" INTEGER NOT NULL,
    "possession_time" TEXT NOT NULL,

    CONSTRAINT "nfl_team_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassingStatistics" (
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
    "nfl_statistic_id" TEXT,

    CONSTRAINT "PassingStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RushingStatistics" (
    "id" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_attempt" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "nfl_statistic_id" TEXT,

    CONSTRAINT "RushingStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceivingStatistics" (
    "id" TEXT NOT NULL,
    "receptions" INTEGER NOT NULL,
    "targets" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_reception" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "nfl_statistic_id" TEXT,

    CONSTRAINT "ReceivingStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FumbleStatistics" (
    "id" TEXT NOT NULL,
    "fumbles" INTEGER NOT NULL,
    "lost" INTEGER NOT NULL,
    "recovered" INTEGER NOT NULL,
    "nfl_statistic_id" TEXT,

    CONSTRAINT "FumbleStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefensiveStatistics" (
    "id" TEXT NOT NULL,
    "total_tackles" INTEGER NOT NULL,
    "solo_tackles" INTEGER NOT NULL,
    "sacks" DOUBLE PRECISION NOT NULL,
    "tackles_for_loss" DOUBLE PRECISION NOT NULL,
    "passes_defended" INTEGER NOT NULL,
    "qb_hits" INTEGER NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "nfl_statistic_id" TEXT,

    CONSTRAINT "DefensiveStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterceptionStatistics" (
    "id" TEXT NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "nfl_statistic_id" TEXT,

    CONSTRAINT "InterceptionStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KickReturnStatistics" (
    "id" TEXT NOT NULL,
    "returns" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_return" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "nfl_statistic_id" TEXT,

    CONSTRAINT "KickReturnStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntReturnStatistics" (
    "id" TEXT NOT NULL,
    "returns" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_return" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "nfl_statistic_id" TEXT,

    CONSTRAINT "PuntReturnStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KickingStatistics" (
    "id" TEXT NOT NULL,
    "field_goal_attempts" INTEGER NOT NULL,
    "field_goal_made" INTEGER NOT NULL,
    "field_goal_pct" DOUBLE PRECISION NOT NULL,
    "longest" INTEGER NOT NULL,
    "extra_point_attempts" INTEGER NOT NULL,
    "extra_point_made" INTEGER NOT NULL,
    "total_points" INTEGER NOT NULL,
    "nfl_statistic_id" TEXT,

    CONSTRAINT "KickingStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntingStatistics" (
    "id" TEXT NOT NULL,
    "punts" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_punt" DOUBLE PRECISION NOT NULL,
    "longest" INTEGER NOT NULL,
    "punts_inside_20" INTEGER NOT NULL,
    "touchbacks" INTEGER NOT NULL,
    "nfl_statistic_id" TEXT,

    CONSTRAINT "PuntingStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_game_statistics_nfl_statistic_id_key" ON "team_game_statistics"("nfl_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "athlete_game_statistics_nfl_statistic_id_key" ON "athlete_game_statistics"("nfl_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_nfl_team_statistic_id_key" ON "nfl_statistics"("nfl_team_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_athletes_athlete_id_key" ON "fps_athletes"("athlete_id");

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_statistics" ADD CONSTRAINT "team_game_statistics_team_game_id_fkey" FOREIGN KEY ("team_game_id") REFERENCES "team_games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_statistics" ADD CONSTRAINT "team_game_statistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_game_statistics" ADD CONSTRAINT "athlete_game_statistics_team_game_id_fkey" FOREIGN KEY ("team_game_id") REFERENCES "team_games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_game_statistics" ADD CONSTRAINT "athlete_game_statistics_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_game_statistics" ADD CONSTRAINT "athlete_game_statistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_nfl_team_statistic_id_fkey" FOREIGN KEY ("nfl_team_statistic_id") REFERENCES "nfl_team_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassingStatistics" ADD CONSTRAINT "PassingStatistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RushingStatistics" ADD CONSTRAINT "RushingStatistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivingStatistics" ADD CONSTRAINT "ReceivingStatistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FumbleStatistics" ADD CONSTRAINT "FumbleStatistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefensiveStatistics" ADD CONSTRAINT "DefensiveStatistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterceptionStatistics" ADD CONSTRAINT "InterceptionStatistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KickReturnStatistics" ADD CONSTRAINT "KickReturnStatistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntReturnStatistics" ADD CONSTRAINT "PuntReturnStatistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KickingStatistics" ADD CONSTRAINT "KickingStatistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntingStatistics" ADD CONSTRAINT "PuntingStatistics_nfl_statistic_id_fkey" FOREIGN KEY ("nfl_statistic_id") REFERENCES "nfl_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_athletes" ADD CONSTRAINT "fps_athletes_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
