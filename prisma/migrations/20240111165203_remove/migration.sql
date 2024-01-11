/*
  Warnings:

  - You are about to drop the `team_games` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `away_team_id` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `home_team_id` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "team_games" DROP CONSTRAINT "team_games_game_id_fkey";

-- DropForeignKey
ALTER TABLE "team_games" DROP CONSTRAINT "team_games_team_id_fkey";

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "away_team_id" TEXT NOT NULL,
ADD COLUMN     "home_team_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "team_games";
