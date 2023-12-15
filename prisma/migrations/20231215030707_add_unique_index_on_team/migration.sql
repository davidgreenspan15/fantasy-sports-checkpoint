/*
  Warnings:

  - A unique constraint covering the columns `[espn_id,league_id]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "teams_espn_id_league_id_key" ON "teams"("espn_id", "league_id");
