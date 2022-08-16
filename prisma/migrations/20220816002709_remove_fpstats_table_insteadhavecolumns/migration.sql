/*
  Warnings:

  - You are about to drop the column `avgAdp` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `avgFanPoints` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `avgPassingTds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `avgPassingYds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `avgReceivingRec` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `avgReceivingTds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `avgReceivingYds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `avgRushiingYds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `avgRushingAtt` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `avgRushingTds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `byeWeek` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `playerNmae` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `strengthOgSchedule` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `totalFanPoints` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `totalPassingTds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `totalPassingYds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `totalReceivingRec` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `totalReceivingTds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `totalReceivingYds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `totalRushiingYds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `totalRushingAtt` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `totalRushingTds` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `leagues` table. All the data in the column will be lost.
  - You are about to drop the column `depthChartUrl` on the `leagues` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `leagues` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `injuryStatus` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `leagueId` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `playerDepthPosition` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `playerImageSrc` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `playerUrl` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `positionGroup` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `wrSet` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `depthChartUrl` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `imgSrc` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `leagueId` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `rosterUrl` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `teams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[player_id]` on the table `fantasy_pros_data` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `avg_adp` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avg_fan_points` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avg_passing_tds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avg_passing_yards` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avg_receiving_rec` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avg_receiving_tds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avg_receiving_yds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avg_rushing_att` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avg_rushing_tds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avg_rushing_yds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bye_week` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_id` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_name` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strength_of_schedule` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_fan_points` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_passing_tds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_passing_yds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_receiving_rec` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_receiving_tds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_receiving_yds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_rushing_att` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_rushing_tds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_rushing_yds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depth_chart_url` to the `leagues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_image_src` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_url` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position_group` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depth_chart_url` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_src` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `league_id` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roster_url` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "fantasy_pros_data" DROP CONSTRAINT "fantasy_pros_data_playerId_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_teamId_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_leagueId_fkey";

-- DropIndex
DROP INDEX "fantasy_pros_data_playerId_key";

-- AlterTable
ALTER TABLE "fantasy_pros_data" DROP COLUMN "avgAdp",
DROP COLUMN "avgFanPoints",
DROP COLUMN "avgPassingTds",
DROP COLUMN "avgPassingYds",
DROP COLUMN "avgReceivingRec",
DROP COLUMN "avgReceivingTds",
DROP COLUMN "avgReceivingYds",
DROP COLUMN "avgRushiingYds",
DROP COLUMN "avgRushingAtt",
DROP COLUMN "avgRushingTds",
DROP COLUMN "byeWeek",
DROP COLUMN "createdAt",
DROP COLUMN "playerId",
DROP COLUMN "playerNmae",
DROP COLUMN "strengthOgSchedule",
DROP COLUMN "totalFanPoints",
DROP COLUMN "totalPassingTds",
DROP COLUMN "totalPassingYds",
DROP COLUMN "totalReceivingRec",
DROP COLUMN "totalReceivingTds",
DROP COLUMN "totalReceivingYds",
DROP COLUMN "totalRushiingYds",
DROP COLUMN "totalRushingAtt",
DROP COLUMN "totalRushingTds",
DROP COLUMN "updatedAt",
ADD COLUMN     "avg_adp" TEXT NOT NULL,
ADD COLUMN     "avg_fan_points" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avg_passing_tds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avg_passing_yards" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avg_receiving_rec" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avg_receiving_tds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avg_receiving_yds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avg_rushing_att" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avg_rushing_tds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avg_rushing_yds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bye_week" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "player_id" TEXT NOT NULL,
ADD COLUMN     "player_name" TEXT NOT NULL,
ADD COLUMN     "strength_of_schedule" TEXT NOT NULL,
ADD COLUMN     "total_fan_points" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_passing_tds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_passing_yds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_receiving_rec" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_receiving_tds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_receiving_yds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_rushing_att" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_rushing_tds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_rushing_yds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "leagues" DROP COLUMN "createdAt",
DROP COLUMN "depthChartUrl",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "depth_chart_url" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "players" DROP COLUMN "createdAt",
DROP COLUMN "injuryStatus",
DROP COLUMN "leagueId",
DROP COLUMN "playerDepthPosition",
DROP COLUMN "playerImageSrc",
DROP COLUMN "playerUrl",
DROP COLUMN "positionGroup",
DROP COLUMN "teamId",
DROP COLUMN "updatedAt",
DROP COLUMN "wrSet",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "injury_status" TEXT,
ADD COLUMN     "league_id" TEXT,
ADD COLUMN     "player_depth_position" TEXT[],
ADD COLUMN     "player_image_src" TEXT NOT NULL,
ADD COLUMN     "player_url" TEXT NOT NULL,
ADD COLUMN     "position_group" TEXT NOT NULL,
ADD COLUMN     "team_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "wr_set" INTEGER;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "createdAt",
DROP COLUMN "depthChartUrl",
DROP COLUMN "imgSrc",
DROP COLUMN "leagueId",
DROP COLUMN "rosterUrl",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "depth_chart_url" TEXT NOT NULL,
ADD COLUMN     "img_src" TEXT NOT NULL,
ADD COLUMN     "league_id" TEXT NOT NULL,
ADD COLUMN     "roster_url" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "fantasy_pros_data_player_id_key" ON "fantasy_pros_data"("player_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fantasy_pros_data" ADD CONSTRAINT "fantasy_pros_data_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
