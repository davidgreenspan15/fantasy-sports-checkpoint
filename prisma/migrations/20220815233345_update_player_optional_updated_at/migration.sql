-- AlterTable
ALTER TABLE "fantasy_pros_data" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "fantasy_pros_stats" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "players" ALTER COLUMN "updatedAt" DROP NOT NULL;
