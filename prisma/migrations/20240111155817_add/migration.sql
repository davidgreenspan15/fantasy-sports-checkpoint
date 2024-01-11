/*
  Warnings:

  - You are about to drop the column `nfl_statistic_id` on the `DefensiveStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `FumbleStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `InterceptionStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `KickReturnStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `KickingStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `PassingStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `PuntReturnStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `PuntingStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `ReceivingStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `RushingStatistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `athlete_game_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_team_statistic_id` on the `nfl_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `team_game_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `nfl_statistic_id` on the `team_game_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `team_game_id` on the `team_game_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `team_game_statistics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[athlete_game_statistic_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[passing_statistics_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rushing_statistics_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receiving_statistics_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fumble_statistics_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[defensive_statistics_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[interception_statistics_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kick_return_statistics_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[punt_return_statistics_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kicking_statistics_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[punting_statistics_id]` on the table `nfl_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[team_game_statistic_id]` on the table `nfl_team_statistics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[athlete_total_statistics_id]` on the table `nfl_team_statistics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameStatisticId` to the `athlete_game_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `athlete_game_statistic_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defensive_statistics_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fumble_statistics_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interception_statistics_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kick_return_statistics_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kicking_statistics_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passing_statistics_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `punt_return_statistics_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `punting_statistics_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiving_statistics_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rushing_statistics_id` to the `nfl_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `athlete_total_statistics_id` to the `nfl_team_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_game_statistic_id` to the `nfl_team_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameStatisticId` to the `team_game_statistics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `team_game_statistics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DefensiveStatistics" DROP CONSTRAINT "DefensiveStatistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "FumbleStatistics" DROP CONSTRAINT "FumbleStatistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "InterceptionStatistics" DROP CONSTRAINT "InterceptionStatistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "KickReturnStatistics" DROP CONSTRAINT "KickReturnStatistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "KickingStatistics" DROP CONSTRAINT "KickingStatistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "PassingStatistics" DROP CONSTRAINT "PassingStatistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "PuntReturnStatistics" DROP CONSTRAINT "PuntReturnStatistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "PuntingStatistics" DROP CONSTRAINT "PuntingStatistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "ReceivingStatistics" DROP CONSTRAINT "ReceivingStatistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "RushingStatistics" DROP CONSTRAINT "RushingStatistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "athlete_game_statistics" DROP CONSTRAINT "athlete_game_statistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "athlete_game_statistics" DROP CONSTRAINT "athlete_game_statistics_team_game_id_fkey";

-- DropForeignKey
ALTER TABLE "nfl_statistics" DROP CONSTRAINT "nfl_statistics_nfl_team_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "team_game_statistics" DROP CONSTRAINT "team_game_statistics_nfl_statistic_id_fkey";

-- DropForeignKey
ALTER TABLE "team_game_statistics" DROP CONSTRAINT "team_game_statistics_team_game_id_fkey";

-- DropIndex
DROP INDEX "athlete_game_statistics_nfl_statistic_id_key";

-- DropIndex
DROP INDEX "nfl_statistics_nfl_team_statistic_id_key";

-- DropIndex
DROP INDEX "team_game_statistics_nfl_statistic_id_key";

-- AlterTable
ALTER TABLE "DefensiveStatistics" DROP COLUMN "nfl_statistic_id";

-- AlterTable
ALTER TABLE "FumbleStatistics" DROP COLUMN "nfl_statistic_id";

-- AlterTable
ALTER TABLE "InterceptionStatistics" DROP COLUMN "nfl_statistic_id";

-- AlterTable
ALTER TABLE "KickReturnStatistics" DROP COLUMN "nfl_statistic_id";

-- AlterTable
ALTER TABLE "KickingStatistics" DROP COLUMN "nfl_statistic_id";

-- AlterTable
ALTER TABLE "PassingStatistics" DROP COLUMN "nfl_statistic_id";

-- AlterTable
ALTER TABLE "PuntReturnStatistics" DROP COLUMN "nfl_statistic_id";

-- AlterTable
ALTER TABLE "PuntingStatistics" DROP COLUMN "nfl_statistic_id";

-- AlterTable
ALTER TABLE "ReceivingStatistics" DROP COLUMN "nfl_statistic_id";

-- AlterTable
ALTER TABLE "RushingStatistics" DROP COLUMN "nfl_statistic_id";

-- AlterTable
ALTER TABLE "athlete_game_statistics" DROP COLUMN "nfl_statistic_id",
ADD COLUMN     "gameStatisticId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "nfl_statistics" DROP COLUMN "nfl_team_statistic_id",
ADD COLUMN     "athlete_game_statistic_id" TEXT NOT NULL,
ADD COLUMN     "defensive_statistics_id" TEXT NOT NULL,
ADD COLUMN     "fumble_statistics_id" TEXT NOT NULL,
ADD COLUMN     "interception_statistics_id" TEXT NOT NULL,
ADD COLUMN     "kick_return_statistics_id" TEXT NOT NULL,
ADD COLUMN     "kicking_statistics_id" TEXT NOT NULL,
ADD COLUMN     "passing_statistics_id" TEXT NOT NULL,
ADD COLUMN     "punt_return_statistics_id" TEXT NOT NULL,
ADD COLUMN     "punting_statistics_id" TEXT NOT NULL,
ADD COLUMN     "receiving_statistics_id" TEXT NOT NULL,
ADD COLUMN     "rushing_statistics_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "nfl_team_statistics" ADD COLUMN     "athlete_total_statistics_id" TEXT NOT NULL,
ADD COLUMN     "team_game_statistic_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "team_game_statistics" DROP COLUMN "created_at",
DROP COLUMN "nfl_statistic_id",
DROP COLUMN "team_game_id",
DROP COLUMN "updated_at",
ADD COLUMN     "gameStatisticId" TEXT NOT NULL,
ADD COLUMN     "team_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "game_statistics" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "game_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_athlete_game_statistic_id_key" ON "nfl_statistics"("athlete_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_passing_statistics_id_key" ON "nfl_statistics"("passing_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_rushing_statistics_id_key" ON "nfl_statistics"("rushing_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_receiving_statistics_id_key" ON "nfl_statistics"("receiving_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_fumble_statistics_id_key" ON "nfl_statistics"("fumble_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_defensive_statistics_id_key" ON "nfl_statistics"("defensive_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_interception_statistics_id_key" ON "nfl_statistics"("interception_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_kick_return_statistics_id_key" ON "nfl_statistics"("kick_return_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_punt_return_statistics_id_key" ON "nfl_statistics"("punt_return_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_kicking_statistics_id_key" ON "nfl_statistics"("kicking_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_punting_statistics_id_key" ON "nfl_statistics"("punting_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_team_statistics_team_game_statistic_id_key" ON "nfl_team_statistics"("team_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_team_statistics_athlete_total_statistics_id_key" ON "nfl_team_statistics"("athlete_total_statistics_id");

-- AddForeignKey
ALTER TABLE "game_statistics" ADD CONSTRAINT "game_statistics_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_statistics" ADD CONSTRAINT "team_game_statistics_gameStatisticId_fkey" FOREIGN KEY ("gameStatisticId") REFERENCES "game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_statistics" ADD CONSTRAINT "team_game_statistics_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_game_statistics" ADD CONSTRAINT "athlete_game_statistics_gameStatisticId_fkey" FOREIGN KEY ("gameStatisticId") REFERENCES "game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_athlete_game_statistic_id_fkey" FOREIGN KEY ("athlete_game_statistic_id") REFERENCES "athlete_game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_passing_statistics_id_fkey" FOREIGN KEY ("passing_statistics_id") REFERENCES "PassingStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_rushing_statistics_id_fkey" FOREIGN KEY ("rushing_statistics_id") REFERENCES "RushingStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_receiving_statistics_id_fkey" FOREIGN KEY ("receiving_statistics_id") REFERENCES "ReceivingStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_fumble_statistics_id_fkey" FOREIGN KEY ("fumble_statistics_id") REFERENCES "FumbleStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_defensive_statistics_id_fkey" FOREIGN KEY ("defensive_statistics_id") REFERENCES "DefensiveStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_interception_statistics_id_fkey" FOREIGN KEY ("interception_statistics_id") REFERENCES "InterceptionStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_kick_return_statistics_id_fkey" FOREIGN KEY ("kick_return_statistics_id") REFERENCES "KickReturnStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_punt_return_statistics_id_fkey" FOREIGN KEY ("punt_return_statistics_id") REFERENCES "PuntReturnStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_kicking_statistics_id_fkey" FOREIGN KEY ("kicking_statistics_id") REFERENCES "KickingStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_punting_statistics_id_fkey" FOREIGN KEY ("punting_statistics_id") REFERENCES "PuntingStatistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_team_statistics" ADD CONSTRAINT "nfl_team_statistics_team_game_statistic_id_fkey" FOREIGN KEY ("team_game_statistic_id") REFERENCES "team_game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_team_statistics" ADD CONSTRAINT "nfl_team_statistics_athlete_total_statistics_id_fkey" FOREIGN KEY ("athlete_total_statistics_id") REFERENCES "nfl_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
