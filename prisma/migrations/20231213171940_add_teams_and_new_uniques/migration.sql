/*
  Warnings:

  - A unique constraint covering the columns `[sport,espn_id]` on the table `leagues` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "leagues_abbreviation_key";

-- DropIndex
DROP INDEX "leagues_espn_id_key";

-- DropIndex
DROP INDEX "leagues_slug_key";

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "short_display_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_league_id_espn_id_key" ON "teams"("league_id", "espn_id");

-- CreateIndex
CREATE UNIQUE INDEX "leagues_sport_espn_id_key" ON "leagues"("sport", "espn_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
