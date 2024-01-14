/*
  Warnings:

  - You are about to drop the column `season_id` on the `teams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[espn_id,season_id,leagueId]` on the table `athletes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[espn_id,season_id,league_id]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[espn_id,leagueId]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_season_id_fkey";

-- DropIndex
DROP INDEX "athletes_espn_id_season_id_key";

-- DropIndex
DROP INDEX "games_espn_id_season_id_key";

-- DropIndex
DROP INDEX "teams_espn_id_season_id_key";

-- AlterTable
ALTER TABLE "athletes" ADD COLUMN     "leagueId" TEXT;

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "league_id" TEXT;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "season_id",
ADD COLUMN     "leagueId" TEXT;

-- CreateTable
CREATE TABLE "_SeasonToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SeasonToTeam_AB_unique" ON "_SeasonToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_SeasonToTeam_B_index" ON "_SeasonToTeam"("B");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_espn_id_season_id_leagueId_key" ON "athletes"("espn_id", "season_id", "leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "games_espn_id_season_id_league_id_key" ON "games"("espn_id", "season_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_espn_id_leagueId_key" ON "teams"("espn_id", "leagueId");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeasonToTeam" ADD CONSTRAINT "_SeasonToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeasonToTeam" ADD CONSTRAINT "_SeasonToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
