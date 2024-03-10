-- AlterTable
ALTER TABLE "games" ADD COLUMN     "away_team_id" TEXT,
ADD COLUMN     "home_team_id" TEXT;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
