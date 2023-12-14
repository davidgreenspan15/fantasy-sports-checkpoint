/*
  Warnings:

  - The primary key for the `games` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `games` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "team_games" DROP CONSTRAINT "team_games_gameId_fkey";

-- AlterTable
ALTER TABLE "games" DROP CONSTRAINT "games_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "games_pkey" PRIMARY KEY ("espn_id");

-- AddForeignKey
ALTER TABLE "team_games" ADD CONSTRAINT "team_games_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("espn_id") ON DELETE SET NULL ON UPDATE CASCADE;
