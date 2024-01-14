/*
  Warnings:

  - You are about to drop the column `leagueId` on the `athletes` table. All the data in the column will be lost.
  - You are about to drop the column `season_id` on the `athletes` table. All the data in the column will be lost.
  - You are about to drop the column `leagueId` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the `_SeasonToTeam` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[espn_id,league_id]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_SeasonToTeam" DROP CONSTRAINT "_SeasonToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_SeasonToTeam" DROP CONSTRAINT "_SeasonToTeam_B_fkey";

-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_season_id_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_leagueId_fkey";

-- DropIndex
DROP INDEX "athletes_espn_id_season_id_leagueId_key";

-- DropIndex
DROP INDEX "teams_espn_id_leagueId_key";

-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "leagueId",
DROP COLUMN "season_id",
ADD COLUMN     "league_id" TEXT;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "leagueId",
ADD COLUMN     "league_id" TEXT;

-- DropTable
DROP TABLE "_SeasonToTeam";

-- CreateIndex
CREATE UNIQUE INDEX "teams_espn_id_league_id_key" ON "teams"("espn_id", "league_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
