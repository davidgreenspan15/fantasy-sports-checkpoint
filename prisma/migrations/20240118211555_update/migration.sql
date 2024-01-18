/*
  Warnings:

  - You are about to drop the column `peanlty_minutes` on the `goalie_statistics` table. All the data in the column will be lost.
  - Added the required column `penalty_minutes` to the `goalie_statistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "goalie_statistics" DROP COLUMN "peanlty_minutes",
ADD COLUMN     "penalty_minutes" INTEGER NOT NULL;
