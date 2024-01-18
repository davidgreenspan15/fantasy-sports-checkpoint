-- CreateTable
CREATE TABLE "nba_statistics" (
    "id" TEXT NOT NULL,
    "athlete_game_statistic_id" TEXT,
    "basketball_statistic_id" TEXT NOT NULL,
    "team_id" TEXT,
    "game_id" TEXT NOT NULL,
    "athlete_id" TEXT,

    CONSTRAINT "nba_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nba_team_statistics" (
    "id" TEXT NOT NULL,
    "field_goals_made" INTEGER NOT NULL,
    "field_goals_attempted" INTEGER NOT NULL,
    "field_goal_percentage" DOUBLE PRECISION NOT NULL,
    "three_pointers_made" INTEGER NOT NULL,
    "three_pointers_attempted" INTEGER NOT NULL,
    "three_point_percentage" DOUBLE PRECISION NOT NULL,
    "free_throws_made" INTEGER NOT NULL,
    "free_throws_attempted" INTEGER NOT NULL,
    "free_throw_percentage" DOUBLE PRECISION NOT NULL,
    "total_rebounds" INTEGER NOT NULL,
    "offensive_rebounds" INTEGER NOT NULL,
    "defensive_rebounds" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "steals" INTEGER NOT NULL,
    "blocks" INTEGER NOT NULL,
    "turnovers" INTEGER NOT NULL,
    "team_turnovers" INTEGER NOT NULL,
    "total_turnovers" INTEGER NOT NULL,
    "technical_fouls" INTEGER NOT NULL,
    "flagrant_fouls" INTEGER NOT NULL,
    "turnovers_points" INTEGER NOT NULL,
    "fast_break_points" INTEGER NOT NULL,
    "points_paint" INTEGER NOT NULL,
    "fouls" INTEGER NOT NULL,
    "largest_lead" INTEGER NOT NULL,
    "team_game_statistic_id" TEXT NOT NULL,
    "athlete_total_statistics_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "nba_team_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basketball_statistics" (
    "id" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "field_goals_made" INTEGER NOT NULL,
    "field_goals_attempted" INTEGER NOT NULL,
    "three_pointers_made" INTEGER NOT NULL,
    "three_pointers_attempted" INTEGER NOT NULL,
    "free_throws_made" INTEGER NOT NULL,
    "free_throws_attempted" INTEGER NOT NULL,
    "offensive_rebounds" INTEGER NOT NULL,
    "defensive_rebounds" INTEGER NOT NULL,
    "rebounds" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "steals" INTEGER NOT NULL,
    "blocks" INTEGER NOT NULL,
    "turnovers" INTEGER NOT NULL,
    "fouls" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "plus_minus" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "basketball_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nba_statistics_athlete_game_statistic_id_key" ON "nba_statistics"("athlete_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_statistics_basketball_statistic_id_key" ON "nba_statistics"("basketball_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_statistics_game_id_athlete_id_key" ON "nba_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_statistics_game_id_team_id_key" ON "nba_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_team_statistics_team_game_statistic_id_key" ON "nba_team_statistics"("team_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_team_statistics_athlete_total_statistics_id_key" ON "nba_team_statistics"("athlete_total_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_team_statistics_game_id_team_id_key" ON "nba_team_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "basketball_statistics_game_id_team_id_key" ON "basketball_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "basketball_statistics_game_id_athlete_id_key" ON "basketball_statistics"("game_id", "athlete_id");

-- AddForeignKey
ALTER TABLE "nba_statistics" ADD CONSTRAINT "nba_statistics_athlete_game_statistic_id_fkey" FOREIGN KEY ("athlete_game_statistic_id") REFERENCES "athlete_game_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nba_statistics" ADD CONSTRAINT "nba_statistics_basketball_statistic_id_fkey" FOREIGN KEY ("basketball_statistic_id") REFERENCES "basketball_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nba_team_statistics" ADD CONSTRAINT "nba_team_statistics_team_game_statistic_id_fkey" FOREIGN KEY ("team_game_statistic_id") REFERENCES "team_game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nba_team_statistics" ADD CONSTRAINT "nba_team_statistics_athlete_total_statistics_id_fkey" FOREIGN KEY ("athlete_total_statistics_id") REFERENCES "nba_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
