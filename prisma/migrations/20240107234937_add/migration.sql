/*
  Warnings:

  - A unique constraint covering the columns `[fps_athlete_id]` on the table `fps_average_stats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fps_athlete_id]` on the table `fps_notes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fps_athlete_id]` on the table `fps_overviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fps_athlete_id]` on the table `fps_ranks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fps_athlete_id]` on the table `fps_total_stats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "fps_average_stats" ADD COLUMN     "fps_athlete_id" TEXT;

-- AlterTable
ALTER TABLE "fps_notes" ADD COLUMN     "fps_athlete_id" TEXT;

-- AlterTable
ALTER TABLE "fps_overviews" ADD COLUMN     "fps_athlete_id" TEXT;

-- AlterTable
ALTER TABLE "fps_ranks" ADD COLUMN     "fps_athlete_id" TEXT;

-- AlterTable
ALTER TABLE "fps_total_stats" ADD COLUMN     "fps_athlete_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "fps_average_stats_fps_athlete_id_key" ON "fps_average_stats"("fps_athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_notes_fps_athlete_id_key" ON "fps_notes"("fps_athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_overviews_fps_athlete_id_key" ON "fps_overviews"("fps_athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_ranks_fps_athlete_id_key" ON "fps_ranks"("fps_athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_total_stats_fps_athlete_id_key" ON "fps_total_stats"("fps_athlete_id");
