/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `teams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "teams_league_id_espn_id_key";

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "uid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "teams_uid_key" ON "teams"("uid");
