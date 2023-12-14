/*
  Warnings:

  - A unique constraint covering the columns `[league_id,espn_id]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `league_id` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "games_espn_id_idx";

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "league_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "games_league_id_espn_id_key" ON "games"("league_id", "espn_id");
