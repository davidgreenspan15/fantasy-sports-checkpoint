/*
  Warnings:

  - A unique constraint covering the columns `[league_id,espn_player_id]` on the table `players` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "players" ADD COLUMN     "espn_player_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "players_league_id_espn_player_id_key" ON "players"("league_id", "espn_player_id");
