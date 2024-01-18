/*
  Warnings:

  - A unique constraint covering the columns `[game_id,team_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `game_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nfl_statistics" ADD COLUMN     "game_id" TEXT NOT NULL,
ADD COLUMN     "team_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_game_id_team_id_key" ON "nfl_statistics"("game_id", "team_id");
