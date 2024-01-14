/*
  Warnings:

  - Added the required column `name` to the `seasons` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `seasons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "seasons" ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "seasons_year_number_type_key" ON "seasons"("year_number", "type");
