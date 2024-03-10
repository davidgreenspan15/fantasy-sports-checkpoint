-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_position_id_fkey";

-- AlterTable
ALTER TABLE "athletes" ALTER COLUMN "position_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
