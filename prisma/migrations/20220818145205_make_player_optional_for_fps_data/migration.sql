-- DropForeignKey
ALTER TABLE "fantasy_pros_data" DROP CONSTRAINT "fantasy_pros_data_player_id_fkey";

-- AlterTable
ALTER TABLE "fantasy_pros_data" ALTER COLUMN "player_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "fantasy_pros_data" ADD CONSTRAINT "fantasy_pros_data_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;
