/*
  Warnings:

  - You are about to drop the column `period` on the `game_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `time_on_clock` on the `game_statistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "game_statistics" DROP COLUMN "period",
DROP COLUMN "time_on_clock";

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "period" INTEGER,
ADD COLUMN     "time_on_clock" TEXT;
