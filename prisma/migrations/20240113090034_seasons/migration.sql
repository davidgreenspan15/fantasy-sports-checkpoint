/*
  Warnings:

  - You are about to drop the column `league_id` on the `seasons` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_league_id_fkey";

-- AlterTable
ALTER TABLE "seasons" DROP COLUMN "league_id";

-- CreateTable
CREATE TABLE "_LeagueToSeason" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LeagueToSeason_AB_unique" ON "_LeagueToSeason"("A", "B");

-- CreateIndex
CREATE INDEX "_LeagueToSeason_B_index" ON "_LeagueToSeason"("B");

-- AddForeignKey
ALTER TABLE "_LeagueToSeason" ADD CONSTRAINT "_LeagueToSeason_A_fkey" FOREIGN KEY ("A") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeagueToSeason" ADD CONSTRAINT "_LeagueToSeason_B_fkey" FOREIGN KEY ("B") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
