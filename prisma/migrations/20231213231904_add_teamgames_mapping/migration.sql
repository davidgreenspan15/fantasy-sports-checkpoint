/*
  Warnings:

  - You are about to drop the `TeamGames` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeamGames" DROP CONSTRAINT "TeamGames_gameId_fkey";

-- DropForeignKey
ALTER TABLE "TeamGames" DROP CONSTRAINT "TeamGames_teamId_fkey";

-- DropTable
DROP TABLE "TeamGames";

-- CreateTable
CREATE TABLE "team_games" (
    "id" TEXT NOT NULL,
    "teamId" TEXT,
    "gameId" TEXT,
    "is_home" BOOLEAN NOT NULL,

    CONSTRAINT "team_games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "team_games_teamId_gameId_idx" ON "team_games"("teamId", "gameId");

-- AddForeignKey
ALTER TABLE "team_games" ADD CONSTRAINT "team_games_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_games" ADD CONSTRAINT "team_games_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
