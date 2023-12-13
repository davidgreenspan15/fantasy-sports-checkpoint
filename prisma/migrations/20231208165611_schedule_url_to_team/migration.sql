/*
  Warnings:

  - Added the required column `schedule_url` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "schedule_url" TEXT NOT NULL;
