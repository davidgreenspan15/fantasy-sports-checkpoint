/*
  Warnings:

  - A unique constraint covering the columns `[league_id,espn_player_id,name]` on the table `players` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "players_league_id_espn_player_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "players_league_id_espn_player_id_name_key" ON "players"("league_id", "espn_player_id", "name");
