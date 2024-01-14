/*
  Warnings:

  - A unique constraint covering the columns `[game_id]` on the table `game_statistics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "game_statistics_game_id_key" ON "game_statistics"("game_id");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
