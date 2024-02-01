-- DropForeignKey
ALTER TABLE "nba_statistics" DROP CONSTRAINT "nba_statistics_basketball_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_defensive_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_fumble_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_interception_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_kick_return_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_kicking_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_passing_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_punt_return_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_punting_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_receiving_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_rushing_statistics_id_fkey";

-- DropForeignKey
ALTER TABLE "nhl_statistics" DROP CONSTRAINT "nhl_statistics_goalie_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "nhl_statistics" DROP CONSTRAINT "nhl_statistics_skater_statistic_id_fkey";

-- AlterTable
ALTER TABLE "nba_statistics" ALTER COLUMN "basketball_statistic_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "nfl_statistics" ALTER COLUMN "passing_statistics_id" DROP NOT NULL,
ALTER COLUMN "rushing_statistics_id" DROP NOT NULL,
ALTER COLUMN "receiving_statistics_id" DROP NOT NULL,
ALTER COLUMN "fumble_statistics_id" DROP NOT NULL,
ALTER COLUMN "defensive_statistics_id" DROP NOT NULL,
ALTER COLUMN "interception_statistics_id" DROP NOT NULL,
ALTER COLUMN "kick_return_statistics_id" DROP NOT NULL,
ALTER COLUMN "punt_return_statistics_id" DROP NOT NULL,
ALTER COLUMN "kicking_statistics_id" DROP NOT NULL,
ALTER COLUMN "punting_statistics_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "nhl_statistics" ALTER COLUMN "skater_statistic_id" DROP NOT NULL,
ALTER COLUMN "goalie_statistic_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_passing_statistics_id_fkey" FOREIGN KEY ("passing_statistics_id") REFERENCES "passing_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_rushing_statistics_id_fkey" FOREIGN KEY ("rushing_statistics_id") REFERENCES "rushing_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_receiving_statistics_id_fkey" FOREIGN KEY ("receiving_statistics_id") REFERENCES "receiving_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_fumble_statistics_id_fkey" FOREIGN KEY ("fumble_statistics_id") REFERENCES "fumble_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_defensive_statistics_id_fkey" FOREIGN KEY ("defensive_statistics_id") REFERENCES "defensive_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_interception_statistics_id_fkey" FOREIGN KEY ("interception_statistics_id") REFERENCES "interception_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_kick_return_statistics_id_fkey" FOREIGN KEY ("kick_return_statistics_id") REFERENCES "kick_return_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_punt_return_statistics_id_fkey" FOREIGN KEY ("punt_return_statistics_id") REFERENCES "punt_return_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_kicking_statistics_id_fkey" FOREIGN KEY ("kicking_statistics_id") REFERENCES "kicking_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_punting_statistics_id_fkey" FOREIGN KEY ("punting_statistics_id") REFERENCES "punting_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nba_statistics" ADD CONSTRAINT "nba_statistics_basketball_statistic_id_fkey" FOREIGN KEY ("basketball_statistic_id") REFERENCES "basketball_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_statistics" ADD CONSTRAINT "nhl_statistics_skater_statistic_id_fkey" FOREIGN KEY ("skater_statistic_id") REFERENCES "skater_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_statistics" ADD CONSTRAINT "nhl_statistics_goalie_statistic_id_fkey" FOREIGN KEY ("goalie_statistic_id") REFERENCES "goalie_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
