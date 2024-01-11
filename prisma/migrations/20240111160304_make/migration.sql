/*
  Warnings:

  - You are about to drop the column `gameStatisticId` on the `athlete_game_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `gameStatisticId` on the `team_game_statistics` table. All the data in the column will be lost.
  - Added the required column `game_statistic_id` to the `athlete_game_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `game_statistic_id` to the `team_game_statistics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "athlete_game_statistics" DROP CONSTRAINT "athlete_game_statistics_gameStatisticId_fkey";

-- DropForeignKey
ALTER TABLE "team_game_statistics" DROP CONSTRAINT "team_game_statistics_gameStatisticId_fkey";

-- AlterTable
ALTER TABLE "athlete_game_statistics" DROP COLUMN "gameStatisticId",
ADD COLUMN     "game_statistic_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "team_game_statistics" DROP COLUMN "gameStatisticId",
ADD COLUMN     "game_statistic_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "team_game_statistics" ADD CONSTRAINT "team_game_statistics_game_statistic_id_fkey" FOREIGN KEY ("game_statistic_id") REFERENCES "game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_game_statistics" ADD CONSTRAINT "athlete_game_statistics_game_statistic_id_fkey" FOREIGN KEY ("game_statistic_id") REFERENCES "game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
