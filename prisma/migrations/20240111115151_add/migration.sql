-- DropForeignKey
ALTER TABLE "fps_athletes" DROP CONSTRAINT "fps_athletes_athlete_id_fkey";

-- AlterTable
ALTER TABLE "fps_athletes" ALTER COLUMN "athlete_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "fps_athletes" ADD CONSTRAINT "fps_athletes_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
