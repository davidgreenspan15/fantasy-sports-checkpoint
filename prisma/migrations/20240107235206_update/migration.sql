/*
  Warnings:

  - You are about to drop the column `athlete_id` on the `fps_athletes` table. All the data in the column will be lost.
  - You are about to drop the column `average_stats_id` on the `fps_athletes` table. All the data in the column will be lost.
  - You are about to drop the column `note_id` on the `fps_athletes` table. All the data in the column will be lost.
  - You are about to drop the column `overview_id` on the `fps_athletes` table. All the data in the column will be lost.
  - You are about to drop the column `rank_id` on the `fps_athletes` table. All the data in the column will be lost.
  - You are about to drop the column `total_stats_id` on the `fps_athletes` table. All the data in the column will be lost.
  - Made the column `fps_athlete_id` on table `fps_average_stats` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fps_athlete_id` on table `fps_notes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fps_athlete_id` on table `fps_overviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fps_athlete_id` on table `fps_ranks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fps_athlete_id` on table `fps_total_stats` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "fps_athletes" DROP CONSTRAINT "fps_athletes_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "fps_athletes" DROP CONSTRAINT "fps_athletes_average_stats_id_fkey";

-- DropForeignKey
ALTER TABLE "fps_athletes" DROP CONSTRAINT "fps_athletes_note_id_fkey";

-- DropForeignKey
ALTER TABLE "fps_athletes" DROP CONSTRAINT "fps_athletes_overview_id_fkey";

-- DropForeignKey
ALTER TABLE "fps_athletes" DROP CONSTRAINT "fps_athletes_rank_id_fkey";

-- DropForeignKey
ALTER TABLE "fps_athletes" DROP CONSTRAINT "fps_athletes_total_stats_id_fkey";

-- DropIndex
DROP INDEX "fps_athletes_athlete_id_key";

-- DropIndex
DROP INDEX "fps_athletes_average_stats_id_key";

-- DropIndex
DROP INDEX "fps_athletes_note_id_key";

-- DropIndex
DROP INDEX "fps_athletes_overview_id_key";

-- DropIndex
DROP INDEX "fps_athletes_rank_id_key";

-- DropIndex
DROP INDEX "fps_athletes_total_stats_id_key";

-- AlterTable
ALTER TABLE "athletes" ADD COLUMN     "fpsAthleteId" TEXT;

-- AlterTable
ALTER TABLE "fps_athletes" DROP COLUMN "athlete_id",
DROP COLUMN "average_stats_id",
DROP COLUMN "note_id",
DROP COLUMN "overview_id",
DROP COLUMN "rank_id",
DROP COLUMN "total_stats_id";

-- AlterTable
ALTER TABLE "fps_average_stats" ALTER COLUMN "fps_athlete_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "fps_notes" ALTER COLUMN "fps_athlete_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "fps_overviews" ALTER COLUMN "fps_athlete_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "fps_ranks" ALTER COLUMN "fps_athlete_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "fps_total_stats" ALTER COLUMN "fps_athlete_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_fpsAthleteId_fkey" FOREIGN KEY ("fpsAthleteId") REFERENCES "fps_athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_average_stats" ADD CONSTRAINT "fps_average_stats_fps_athlete_id_fkey" FOREIGN KEY ("fps_athlete_id") REFERENCES "fps_athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_total_stats" ADD CONSTRAINT "fps_total_stats_fps_athlete_id_fkey" FOREIGN KEY ("fps_athlete_id") REFERENCES "fps_athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_ranks" ADD CONSTRAINT "fps_ranks_fps_athlete_id_fkey" FOREIGN KEY ("fps_athlete_id") REFERENCES "fps_athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_notes" ADD CONSTRAINT "fps_notes_fps_athlete_id_fkey" FOREIGN KEY ("fps_athlete_id") REFERENCES "fps_athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_overviews" ADD CONSTRAINT "fps_overviews_fps_athlete_id_fkey" FOREIGN KEY ("fps_athlete_id") REFERENCES "fps_athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
