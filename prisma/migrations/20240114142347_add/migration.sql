/*
  Warnings:

  - You are about to drop the column `season_id` on the `athletes` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `seasons` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[year_id,type]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year_id` to the `seasons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_season_id_fkey";

-- DropIndex
DROP INDEX "seasons_year_type_key";

-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "season_id";

-- AlterTable
ALTER TABLE "seasons" DROP COLUMN "year",
ADD COLUMN     "year_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "years" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "years_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "years_year_key" ON "years"("year");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_year_id_type_key" ON "seasons"("year_id", "type");

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
