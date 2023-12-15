/*
  Warnings:

  - A unique constraint covering the columns `[league_id,athlete_id,depth_id]` on the table `athlete_depths` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[league_id,position_id,depth_id]` on the table `position_depths` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `league_id` to the `athlete_depths` table without a default value. This is not possible if the table is not empty.
  - Added the required column `league_id` to the `position_depths` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "athlete_depths_athlete_id_depth_id_key";

-- DropIndex
DROP INDEX "position_depths_position_id_depth_id_key";

-- AlterTable
ALTER TABLE "athlete_depths" ADD COLUMN     "league_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "position_depths" ADD COLUMN     "league_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "athlete_depths_league_id_athlete_id_depth_id_key" ON "athlete_depths"("league_id", "athlete_id", "depth_id");

-- CreateIndex
CREATE UNIQUE INDEX "position_depths_league_id_position_id_depth_id_key" ON "position_depths"("league_id", "position_id", "depth_id");
