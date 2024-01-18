/*
  Warnings:

  - A unique constraint covering the columns `[game_statistic_id,team_id]` on the table `team_game_statistics` will be added. If there are existing duplicate values, this will fail.
  - Made the column `season_id` on table `games` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year_number` on table `seasons` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_season_id_fkey";

-- DropForeignKey
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_year_number_fkey";

-- AlterTable
ALTER TABLE "games" ALTER COLUMN "season_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "seasons" ALTER COLUMN "year_number" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "team_game_statistics_game_statistic_id_team_id_key" ON "team_game_statistics"("game_statistic_id", "team_id");

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_year_number_fkey" FOREIGN KEY ("year_number") REFERENCES "years"("year") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
