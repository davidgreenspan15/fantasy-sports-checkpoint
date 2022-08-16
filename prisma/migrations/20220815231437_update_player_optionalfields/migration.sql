/*
  Warnings:

  - You are about to drop the column `rank` on the `players` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "players" DROP COLUMN "rank",
ALTER COLUMN "injuryStatus" DROP NOT NULL,
ALTER COLUMN "depth" DROP NOT NULL,
ALTER COLUMN "wrSet" DROP NOT NULL,
ALTER COLUMN "age" DROP NOT NULL;
