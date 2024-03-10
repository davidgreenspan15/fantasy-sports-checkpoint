/*
  Warnings:

  - You are about to drop the column `away_team_id` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `home_team_id` on the `games` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_away_team_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_home_team_id_fkey";

-- AlterTable
ALTER TABLE "games" DROP COLUMN "away_team_id",
DROP COLUMN "home_team_id";
