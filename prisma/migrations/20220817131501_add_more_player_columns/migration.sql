-- AlterTable
ALTER TABLE "players" ADD COLUMN     "batting" TEXT,
ADD COLUMN     "birth_date" TEXT,
ADD COLUMN     "birth_place" TEXT,
ADD COLUMN     "salary" TEXT,
ADD COLUMN     "shot" TEXT,
ADD COLUMN     "throwing" TEXT,
ALTER COLUMN "pos" DROP NOT NULL,
ALTER COLUMN "experience" DROP NOT NULL,
ALTER COLUMN "college" DROP NOT NULL;
