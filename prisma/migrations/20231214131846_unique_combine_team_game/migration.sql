/*
  Warnings:

  - A unique constraint covering the columns `[teamId,gameId]` on the table `team_games` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "team_games_teamId_gameId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "team_games_teamId_gameId_key" ON "team_games"("teamId", "gameId");
