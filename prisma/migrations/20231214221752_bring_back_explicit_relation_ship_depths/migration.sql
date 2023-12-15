/*
  Warnings:

  - You are about to drop the `_AthleteToDepth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DepthToPosition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AthleteToDepth" DROP CONSTRAINT "_AthleteToDepth_A_fkey";

-- DropForeignKey
ALTER TABLE "_AthleteToDepth" DROP CONSTRAINT "_AthleteToDepth_B_fkey";

-- DropForeignKey
ALTER TABLE "_DepthToPosition" DROP CONSTRAINT "_DepthToPosition_A_fkey";

-- DropForeignKey
ALTER TABLE "_DepthToPosition" DROP CONSTRAINT "_DepthToPosition_B_fkey";

-- DropTable
DROP TABLE "_AthleteToDepth";

-- DropTable
DROP TABLE "_DepthToPosition";

-- CreateTable
CREATE TABLE "athlete_depths" (
    "id" TEXT NOT NULL,
    "athlete_id" TEXT NOT NULL,
    "depth_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "athlete_depths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position_depths" (
    "id" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "depth_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "position_depths_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "athlete_depths" ADD CONSTRAINT "athlete_depths_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_depths" ADD CONSTRAINT "athlete_depths_depth_id_fkey" FOREIGN KEY ("depth_id") REFERENCES "depths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_depths" ADD CONSTRAINT "position_depths_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_depths" ADD CONSTRAINT "position_depths_depth_id_fkey" FOREIGN KEY ("depth_id") REFERENCES "depths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
