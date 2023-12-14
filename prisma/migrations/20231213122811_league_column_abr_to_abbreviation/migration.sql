/*
  Warnings:

  - You are about to drop the column `abr` on the `leagues` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[abbreviation]` on the table `leagues` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `abbreviation` to the `leagues` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "leagues_abr_key";

-- AlterTable
ALTER TABLE "leagues" DROP COLUMN "abr",
ADD COLUMN     "abbreviation" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "leagues_abbreviation_key" ON "leagues"("abbreviation");
