-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "conferenceId" TEXT,
ADD COLUMN     "divisionId" TEXT;

-- CreateTable
CREATE TABLE "conferences" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "conferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divisions" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "conference_id" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conferences_uid_key" ON "conferences"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "conferences_espn_id_league_id_key" ON "conferences"("espn_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "divisions_uid_key" ON "divisions"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "divisions_espn_id_league_id_key" ON "divisions"("espn_id", "league_id");

-- AddForeignKey
ALTER TABLE "conferences" ADD CONSTRAINT "conferences_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divisions" ADD CONSTRAINT "divisions_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divisions" ADD CONSTRAINT "divisions_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "conferences"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "divisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
