/*
  Warnings:

  - A unique constraint covering the columns `[display_year,type]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.
  - Made the column `season_id` on table `games` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_season_id_fkey";

-- AlterTable
ALTER TABLE "games" ALTER COLUMN "season_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "seasons_display_year_type_key" ON "seasons"("display_year", "type");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
