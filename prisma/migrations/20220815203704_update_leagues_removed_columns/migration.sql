/*
  Warnings:

  - You are about to drop the column `city` on the `leagues` table. All the data in the column will be lost.
  - You are about to drop the column `imgSrc` on the `leagues` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `leagues` table. All the data in the column will be lost.
  - You are about to drop the column `rosterUrl` on the `leagues` table. All the data in the column will be lost.
  - You are about to drop the column `depthChartUr` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `rosterUr` on the `teams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[abr]` on the table `leagues` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `depthChartUrl` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rosterUrl` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "leagues" DROP COLUMN "city",
DROP COLUMN "imgSrc",
DROP COLUMN "name",
DROP COLUMN "rosterUrl";

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "depthChartUr",
DROP COLUMN "rosterUr",
ADD COLUMN     "depthChartUrl" TEXT NOT NULL,
ADD COLUMN     "rosterUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "leagues_abr_key" ON "leagues"("abr");
