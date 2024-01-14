/*
  Warnings:

  - You are about to drop the column `is_current` on the `seasons` table. All the data in the column will be lost.
  - You are about to drop the `_LeagueToSeason` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LeagueToSeason" DROP CONSTRAINT "_LeagueToSeason_A_fkey";

-- DropForeignKey
ALTER TABLE "_LeagueToSeason" DROP CONSTRAINT "_LeagueToSeason_B_fkey";

-- AlterTable
ALTER TABLE "seasons" DROP COLUMN "is_current";

-- DropTable
DROP TABLE "_LeagueToSeason";
