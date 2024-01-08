/*
  Warnings:

  - A unique constraint covering the columns `[player_name,team]` on the table `fps_athletes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "fps_athletes_player_name_team_key" ON "fps_athletes"("player_name", "team");
