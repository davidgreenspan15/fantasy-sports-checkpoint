/*
  Warnings:

  - Added the required column `league_id` to the `athletes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "athletes" ADD COLUMN     "league_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
