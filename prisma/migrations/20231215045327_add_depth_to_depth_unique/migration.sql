/*
  Warnings:

  - A unique constraint covering the columns `[espn_id,league_id,depth]` on the table `depths` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "depths_espn_id_league_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "depths_espn_id_league_id_depth_key" ON "depths"("espn_id", "league_id", "depth");
