/*
  Warnings:

  - You are about to drop the column `year_id` on the `seasons` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[year_number,type]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_year_id_fkey";

-- DropIndex
DROP INDEX "seasons_year_id_type_key";

-- AlterTable
ALTER TABLE "seasons" DROP COLUMN "year_id",
ADD COLUMN     "year_number" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "seasons_year_number_type_key" ON "seasons"("year_number", "type");

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_year_number_fkey" FOREIGN KEY ("year_number") REFERENCES "years"("year") ON DELETE SET NULL ON UPDATE CASCADE;
