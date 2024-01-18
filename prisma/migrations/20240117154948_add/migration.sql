/*
  Warnings:

  - A unique constraint covering the columns `[game_id,team_id]` on the table `team_game_statistics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `game_id` to the `team_game_statistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "team_game_statistics" ADD COLUMN     "game_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "team_game_statistics_game_id_team_id_key" ON "team_game_statistics"("game_id", "team_id");
