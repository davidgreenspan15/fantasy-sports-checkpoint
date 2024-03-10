/*
  Warnings:

  - You are about to drop the column `conferenceId` on the `teams` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_conferenceId_fkey";

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "conferenceId";
