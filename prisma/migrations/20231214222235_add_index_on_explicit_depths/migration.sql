/*
  Warnings:

  - A unique constraint covering the columns `[athlete_id,depth_id]` on the table `athlete_depths` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[position_id,depth_id]` on the table `position_depths` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "athlete_depths_athlete_id_depth_id_key" ON "athlete_depths"("athlete_id", "depth_id");

-- CreateIndex
CREATE UNIQUE INDEX "position_depths_position_id_depth_id_key" ON "position_depths"("position_id", "depth_id");
