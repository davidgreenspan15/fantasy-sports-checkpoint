/*
  Warnings:

  - A unique constraint covering the columns `[league_id,team_id,game_id]` on the table `team_games` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `league_id` to the `team_games` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "team_games_team_id_game_id_key";

-- AlterTable
ALTER TABLE "team_games" ADD COLUMN     "league_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "team_games_league_id_team_id_game_id_key" ON "team_games"("league_id", "team_id", "game_id");
