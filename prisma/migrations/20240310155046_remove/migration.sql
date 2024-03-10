/*
  Warnings:

  - You are about to drop the column `uid` on the `conferences` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `divisions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "conferences_uid_key";

-- DropIndex
DROP INDEX "divisions_uid_key";

-- AlterTable
ALTER TABLE "conferences" DROP COLUMN "uid";

-- AlterTable
ALTER TABLE "divisions" DROP COLUMN "uid";
