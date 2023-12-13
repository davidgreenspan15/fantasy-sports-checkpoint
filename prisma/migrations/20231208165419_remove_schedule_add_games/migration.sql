/*
  Warnings:

  - You are about to drop the `schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weeks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_week_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_league_id_fkey";

-- DropForeignKey
ALTER TABLE "weeks" DROP CONSTRAINT "weeks_schedule_id_fkey";

-- DropTable
DROP TABLE "schedule";

-- DropTable
DROP TABLE "weeks";
