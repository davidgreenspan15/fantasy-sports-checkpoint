/*
  Warnings:

  - You are about to drop the column `league_id` on the `athletes` table. All the data in the column will be lost.
  - You are about to drop the column `league_id` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `league_id` on the `teams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[espn_id,season_id]` on the table `athletes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[espn_id,season_id]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[espn_id,season_id]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_league_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_league_id_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_league_id_fkey";

-- DropIndex
DROP INDEX "athletes_espn_id_league_id_key";

-- DropIndex
DROP INDEX "games_league_id_espn_id_key";

-- DropIndex
DROP INDEX "teams_espn_id_league_id_key";

-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "league_id",
ADD COLUMN     "season_id" TEXT;

-- AlterTable
ALTER TABLE "games" DROP COLUMN "league_id",
ADD COLUMN     "season_id" TEXT;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "league_id",
ADD COLUMN     "season_id" TEXT;

-- CreateTable
CREATE TABLE "seasons" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "league_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seasons_espn_id_league_id_key" ON "seasons"("espn_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_espn_id_season_id_key" ON "athletes"("espn_id", "season_id");

-- CreateIndex
CREATE UNIQUE INDEX "games_espn_id_season_id_key" ON "games"("espn_id", "season_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_espn_id_season_id_key" ON "teams"("espn_id", "season_id");

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
