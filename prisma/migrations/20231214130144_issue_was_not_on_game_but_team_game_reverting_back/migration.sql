/*
  Warnings:

  - The primary key for the `games` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `games` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "team_games" DROP CONSTRAINT "team_games_gameId_fkey";

-- DropIndex
DROP INDEX "games_espn_id_key";

-- AlterTable
ALTER TABLE "games" DROP CONSTRAINT "games_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "games_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "team_games" ADD CONSTRAINT "team_games_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;
