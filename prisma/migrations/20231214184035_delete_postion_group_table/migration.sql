/*
  Warnings:

  - You are about to drop the column `position_group_id` on the `positions` table. All the data in the column will be lost.
  - You are about to drop the `position_groups` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[espn_id,league_id]` on the table `positions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `espn_id` to the `positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `league_id` to the `positions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "positions" DROP CONSTRAINT "positions_position_group_id_fkey";

-- AlterTable
ALTER TABLE "positions" DROP COLUMN "position_group_id",
ADD COLUMN     "espn_id" TEXT NOT NULL,
ADD COLUMN     "league_id" TEXT NOT NULL,
ADD COLUMN     "parent_position_id" TEXT;

-- DropTable
DROP TABLE "position_groups";

-- CreateIndex
CREATE UNIQUE INDEX "positions_espn_id_league_id_key" ON "positions"("espn_id", "league_id");

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
