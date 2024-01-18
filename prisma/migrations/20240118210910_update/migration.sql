/*
  Warnings:

  - You are about to drop the column `even_time_on_ice` on the `skater_statistics` table. All the data in the column will be lost.
  - Added the required column `even_strength_time_on_ice` to the `skater_statistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "skater_statistics" DROP COLUMN "even_time_on_ice",
ADD COLUMN     "even_strength_time_on_ice" TEXT NOT NULL;
