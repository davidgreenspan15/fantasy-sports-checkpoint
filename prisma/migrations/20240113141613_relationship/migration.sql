/*
  Warnings:

  - A unique constraint covering the columns `[espn_id,league_id]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - Made the column `league_id` on table `athletes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `league_id` on table `games` required. This step will fail if there are existing NULL values in that column.
  - Made the column `league_id` on table `teams` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_league_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_league_id_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_league_id_fkey";

-- DropIndex
DROP INDEX "games_espn_id_season_id_league_id_key";

-- AlterTable
ALTER TABLE "athletes" ADD COLUMN     "season_id" TEXT,
ALTER COLUMN "league_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "games" ALTER COLUMN "league_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "league_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "games_espn_id_league_id_key" ON "games"("espn_id", "league_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
