-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_athlete_game_statistic_id_fkey";

-- AlterTable
ALTER TABLE "nfl_statistics" ALTER COLUMN "athlete_game_statistic_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_athlete_game_statistic_id_fkey" FOREIGN KEY ("athlete_game_statistic_id") REFERENCES "athlete_game_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
