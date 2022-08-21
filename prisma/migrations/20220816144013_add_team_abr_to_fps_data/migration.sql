/*
  Warnings:

  - Added the required column `team_abr` to the `fantasy_pros_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fantasy_pros_data" ADD COLUMN     "team_abr" TEXT NOT NULL;
