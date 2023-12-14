-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_league_id_fkey";

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
