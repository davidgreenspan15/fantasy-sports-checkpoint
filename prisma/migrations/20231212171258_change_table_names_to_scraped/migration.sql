/*
  Warnings:

  - You are about to drop the `_GameToTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `games` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leagues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `players` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GameToTeam" DROP CONSTRAINT "_GameToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameToTeam" DROP CONSTRAINT "_GameToTeam_B_fkey";

-- DropForeignKey
ALTER TABLE "fantasy_pros_data" DROP CONSTRAINT "fantasy_pros_data_player_id_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_league_id_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_team_id_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_league_id_fkey";

-- DropTable
DROP TABLE "_GameToTeam";

-- DropTable
DROP TABLE "games";

-- DropTable
DROP TABLE "leagues";

-- DropTable
DROP TABLE "players";

-- DropTable
DROP TABLE "teams";

-- CreateTable
CREATE TABLE "scraped-leagues" (
    "id" TEXT NOT NULL,
    "teams_list_url" TEXT NOT NULL,
    "abr" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "scraped-leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraped-teams" (
    "id" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "depth_chart_url" TEXT,
    "roster_url" TEXT NOT NULL,
    "team_url" TEXT NOT NULL,
    "schedule_url" TEXT NOT NULL,
    "city" TEXT,
    "name" TEXT,
    "abr" TEXT NOT NULL,
    "img_src" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "scraped-teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraped-players" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "injury_status" TEXT,
    "pos" TEXT,
    "depth" INTEGER,
    "position_group" TEXT,
    "player_url" TEXT NOT NULL,
    "player_image_src" TEXT NOT NULL,
    "height" TEXT,
    "weight" TEXT,
    "experience" TEXT,
    "college" TEXT,
    "age" TEXT,
    "number" TEXT,
    "player_depth_position" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "league_id" TEXT,
    "batting" TEXT,
    "throwing" TEXT,
    "shot" TEXT,
    "birth_place" TEXT,
    "birth_date" TEXT,
    "salary" TEXT,
    "espn_player_id" TEXT,

    CONSTRAINT "scraped-players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraped-games" (
    "id" TEXT NOT NULL,
    "home_team_id" TEXT NOT NULL,
    "away_team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scraped-games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ScrapedGameToScrapedTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "scraped-leagues_abr_key" ON "scraped-leagues"("abr");

-- CreateIndex
CREATE UNIQUE INDEX "scraped-players_league_id_espn_player_id_name_key" ON "scraped-players"("league_id", "espn_player_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_ScrapedGameToScrapedTeam_AB_unique" ON "_ScrapedGameToScrapedTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_ScrapedGameToScrapedTeam_B_index" ON "_ScrapedGameToScrapedTeam"("B");

-- AddForeignKey
ALTER TABLE "scraped-teams" ADD CONSTRAINT "scraped-teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "scraped-leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped-players" ADD CONSTRAINT "scraped-players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "scraped-teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped-players" ADD CONSTRAINT "scraped-players_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "scraped-leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fantasy_pros_data" ADD CONSTRAINT "fantasy_pros_data_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "scraped-players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScrapedGameToScrapedTeam" ADD CONSTRAINT "_ScrapedGameToScrapedTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "scraped-games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScrapedGameToScrapedTeam" ADD CONSTRAINT "_ScrapedGameToScrapedTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "scraped-teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
