/*
  Warnings:

  - You are about to drop the column `parent_position_id` on the `positions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "positions" DROP COLUMN "parent_position_id",
ADD COLUMN     "parent_id" TEXT;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
