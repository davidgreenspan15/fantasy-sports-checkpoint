/*
  Warnings:

  - You are about to drop the column `fantasyProsStatsId` on the `fantasy_pros_data` table. All the data in the column will be lost.
  - You are about to drop the `fantasy_pros_stats` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `avgFanPoints` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgPassingTds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgPassingYds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgReceivingRec` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgReceivingTds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgReceivingYds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgRushiingYds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgRushingAtt` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgRushingTds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalFanPoints` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPassingTds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPassingYds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalReceivingRec` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalReceivingTds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalReceivingYds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRushiingYds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRushingAtt` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRushingTds` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "fantasy_pros_stats" DROP CONSTRAINT "fantasy_pros_stats_fantasyProsDataId_fkey";

-- AlterTable
ALTER TABLE "fantasy_pros_data" DROP COLUMN "fantasyProsStatsId",
ADD COLUMN     "avgFanPoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avgPassingTds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avgPassingYds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avgReceivingRec" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avgReceivingTds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avgReceivingYds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avgRushiingYds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avgRushingAtt" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avgRushingTds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalFanPoints" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalPassingTds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalPassingYds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalReceivingRec" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalReceivingTds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalReceivingYds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalRushiingYds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalRushingAtt" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalRushingTds" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "fantasy_pros_stats";
