/*
  Warnings:

  - You are about to drop the column `playerId` on the `fps_average_stats` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `fps_notes` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `fps_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `fps_ranks` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `fps_total_stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "fps_average_stats" DROP COLUMN "playerId";

-- AlterTable
ALTER TABLE "fps_notes" DROP COLUMN "playerId";

-- AlterTable
ALTER TABLE "fps_overviews" DROP COLUMN "playerId";

-- AlterTable
ALTER TABLE "fps_ranks" DROP COLUMN "playerId";

-- AlterTable
ALTER TABLE "fps_total_stats" DROP COLUMN "playerId";
