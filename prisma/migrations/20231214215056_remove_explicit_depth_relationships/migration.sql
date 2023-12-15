/*
  Warnings:

  - You are about to drop the `athlete_depths` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `position_depths` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "athlete_depths" DROP CONSTRAINT "athlete_depths_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "athlete_depths" DROP CONSTRAINT "athlete_depths_depth_id_fkey";

-- DropForeignKey
ALTER TABLE "position_depths" DROP CONSTRAINT "position_depths_depth_id_fkey";

-- DropForeignKey
ALTER TABLE "position_depths" DROP CONSTRAINT "position_depths_position_id_fkey";

-- DropTable
DROP TABLE "athlete_depths";

-- DropTable
DROP TABLE "position_depths";

-- CreateTable
CREATE TABLE "_AthleteToDepth" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DepthToPosition" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AthleteToDepth_AB_unique" ON "_AthleteToDepth"("A", "B");

-- CreateIndex
CREATE INDEX "_AthleteToDepth_B_index" ON "_AthleteToDepth"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DepthToPosition_AB_unique" ON "_DepthToPosition"("A", "B");

-- CreateIndex
CREATE INDEX "_DepthToPosition_B_index" ON "_DepthToPosition"("B");

-- AddForeignKey
ALTER TABLE "_AthleteToDepth" ADD CONSTRAINT "_AthleteToDepth_A_fkey" FOREIGN KEY ("A") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AthleteToDepth" ADD CONSTRAINT "_AthleteToDepth_B_fkey" FOREIGN KEY ("B") REFERENCES "depths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepthToPosition" ADD CONSTRAINT "_DepthToPosition_A_fkey" FOREIGN KEY ("A") REFERENCES "depths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepthToPosition" ADD CONSTRAINT "_DepthToPosition_B_fkey" FOREIGN KEY ("B") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
