/*
  Warnings:

  - A unique constraint covering the columns `[game_statistic_id,athlete_id]` on the table `athlete_game_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[game_id,athlete_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "nfl_statistics" ADD COLUMN     "athlete_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "athlete_game_statistics_game_statistic_id_athlete_id_key" ON "athlete_game_statistics"("game_statistic_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_game_id_athlete_id_key" ON "nfl_statistics"("game_id", "athlete_id");
