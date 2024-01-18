/*
  Warnings:

  - You are about to drop the column `shooutout_saves` on the `goalie_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `shooutout_shots_against` on the `goalie_statistics` table. All the data in the column will be lost.
  - Added the required column `shootout_saves` to the `goalie_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shootout_shots_against` to the `goalie_statistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "goalie_statistics" DROP COLUMN "shooutout_saves",
DROP COLUMN "shooutout_shots_against",
ADD COLUMN     "shootout_saves" INTEGER NOT NULL,
ADD COLUMN     "shootout_shots_against" INTEGER NOT NULL;
