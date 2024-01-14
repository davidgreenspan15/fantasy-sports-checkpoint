/*
  Warnings:

  - You are about to drop the column `espn_id` on the `seasons` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[year,type]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `seasons` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "seasons_espn_id_league_id_key";

-- AlterTable
ALTER TABLE "seasons" DROP COLUMN "espn_id",
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "seasons_year_type_key" ON "seasons"("year", "type");
