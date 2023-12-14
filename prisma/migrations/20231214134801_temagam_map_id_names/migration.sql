/*
  Warnings:

  - You are about to drop the column `gameId` on the `team_games` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `team_games` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[team_id,game_id]` on the table `team_games` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "team_games" DROP CONSTRAINT "team_games_gameId_fkey";

-- DropForeignKey
ALTER TABLE "team_games" DROP CONSTRAINT "team_games_teamId_fkey";

-- DropIndex
DROP INDEX "team_games_teamId_gameId_key";

-- AlterTable
ALTER TABLE "team_games" DROP COLUMN "gameId",
DROP COLUMN "teamId",
ADD COLUMN     "game_id" TEXT,
ADD COLUMN     "team_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "team_games_team_id_game_id_key" ON "team_games"("team_id", "game_id");

-- AddForeignKey
ALTER TABLE "team_games" ADD CONSTRAINT "team_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_games" ADD CONSTRAINT "team_games_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
