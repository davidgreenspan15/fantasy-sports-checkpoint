/*
  Warnings:

  - You are about to drop the `scraped-games` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scraped-leagues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scraped-players` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scraped-teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ScrapedGameToScrapedTeam" DROP CONSTRAINT "_ScrapedGameToScrapedTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_ScrapedGameToScrapedTeam" DROP CONSTRAINT "_ScrapedGameToScrapedTeam_B_fkey";

-- DropForeignKey
ALTER TABLE "fantasy_pros_data" DROP CONSTRAINT "fantasy_pros_data_player_id_fkey";

-- DropForeignKey
ALTER TABLE "scraped-players" DROP CONSTRAINT "scraped-players_league_id_fkey";

-- DropForeignKey
ALTER TABLE "scraped-players" DROP CONSTRAINT "scraped-players_team_id_fkey";

-- DropForeignKey
ALTER TABLE "scraped-teams" DROP CONSTRAINT "scraped-teams_league_id_fkey";

-- DropTable
DROP TABLE "scraped-games";

-- DropTable
DROP TABLE "scraped-leagues";

-- DropTable
DROP TABLE "scraped-players";

-- DropTable
DROP TABLE "scraped-teams";

-- CreateTable
CREATE TABLE "scraped_leagues" (
    "id" TEXT NOT NULL,
    "teams_list_url" TEXT NOT NULL,
    "abr" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "scraped_leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraped_teams" (
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

    CONSTRAINT "scraped_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraped_players" (
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

    CONSTRAINT "scraped_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraped_games" (
    "id" TEXT NOT NULL,
    "home_team_id" TEXT NOT NULL,
    "away_team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scraped_games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scraped_leagues_abr_key" ON "scraped_leagues"("abr");

-- CreateIndex
CREATE UNIQUE INDEX "scraped_players_league_id_espn_player_id_name_key" ON "scraped_players"("league_id", "espn_player_id", "name");

-- AddForeignKey
ALTER TABLE "scraped_teams" ADD CONSTRAINT "scraped_teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "scraped_leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped_players" ADD CONSTRAINT "scraped_players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "scraped_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped_players" ADD CONSTRAINT "scraped_players_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "scraped_leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fantasy_pros_data" ADD CONSTRAINT "fantasy_pros_data_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "scraped_players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScrapedGameToScrapedTeam" ADD CONSTRAINT "_ScrapedGameToScrapedTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "scraped_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScrapedGameToScrapedTeam" ADD CONSTRAINT "_ScrapedGameToScrapedTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "scraped_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
