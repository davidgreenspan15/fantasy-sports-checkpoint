/*
  Warnings:

  - You are about to drop the `_GameToTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GameToTeam" DROP CONSTRAINT "_GameToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameToTeam" DROP CONSTRAINT "_GameToTeam_B_fkey";

-- DropTable
DROP TABLE "_GameToTeam";

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
