/*
  Warnings:

  - You are about to drop the column `mlbAthleteStatisticId` on the `batting_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `mlbAthleteStatisticId` on the `pitching_statistics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[batting_statistics_id]` on the table `mlb_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pitching_statistics_id]` on the table `mlb_statistics` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "batting_statistics" DROP CONSTRAINT "batting_statistics_mlbAthleteStatisticId_fkey";

-- DropForeignKey
ALTER TABLE "pitching_statistics" DROP CONSTRAINT "pitching_statistics_mlbAthleteStatisticId_fkey";

-- AlterTable
ALTER TABLE "batting_statistics" DROP COLUMN "mlbAthleteStatisticId";

-- AlterTable
ALTER TABLE "mlb_statistics" ADD COLUMN     "batting_statistics_id" TEXT,
ADD COLUMN     "pitching_statistics_id" TEXT;

-- AlterTable
ALTER TABLE "pitching_statistics" DROP COLUMN "mlbAthleteStatisticId";

-- CreateIndex
CREATE UNIQUE INDEX "mlb_statistics_batting_statistics_id_key" ON "mlb_statistics"("batting_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "mlb_statistics_pitching_statistics_id_key" ON "mlb_statistics"("pitching_statistics_id");

-- AddForeignKey
ALTER TABLE "mlb_statistics" ADD CONSTRAINT "mlb_statistics_batting_statistics_id_fkey" FOREIGN KEY ("batting_statistics_id") REFERENCES "batting_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mlb_statistics" ADD CONSTRAINT "mlb_statistics_pitching_statistics_id_fkey" FOREIGN KEY ("pitching_statistics_id") REFERENCES "pitching_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
