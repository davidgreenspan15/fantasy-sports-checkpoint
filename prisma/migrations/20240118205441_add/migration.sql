-- CreateTable
CREATE TABLE "nhl_statistics" (
    "id" TEXT NOT NULL,
    "athlete_game_statistic_id" TEXT,
    "skater_statistic_id" TEXT NOT NULL,
    "goalie_statistic_id" TEXT NOT NULL,
    "team_id" TEXT,
    "game_id" TEXT NOT NULL,
    "athlete_id" TEXT,

    CONSTRAINT "nhl_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nhl_team_statistics" (
    "id" TEXT NOT NULL,
    "blocked_shots" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "takeaways" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL,
    "power_play_goals" INTEGER NOT NULL,
    "power_play_opportunities" INTEGER NOT NULL,
    "power_play_pct" DOUBLE PRECISION NOT NULL,
    "short_handed_goals" INTEGER NOT NULL,
    "shootout_goals" INTEGER NOT NULL,
    "face_offs_won" INTEGER NOT NULL,
    "face_off_pct" DOUBLE PRECISION NOT NULL,
    "giveaways" INTEGER NOT NULL,
    "penalties" INTEGER NOT NULL,
    "penalty_minutes" INTEGER NOT NULL,
    "team_game_statistic_id" TEXT NOT NULL,
    "athlete_total_statistics_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "nhl_team_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skater_statistics" (
    "id" TEXT NOT NULL,
    "blocked_shots" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "takeaways" INTEGER NOT NULL,
    "plus_minus" INTEGER NOT NULL,
    "time_on_ice" TEXT NOT NULL,
    "power_play_time_on_ice" TEXT NOT NULL,
    "short_handed_time_on_ice" TEXT NOT NULL,
    "even_time_on_ice" TEXT NOT NULL,
    "shifts" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL,
    "year_to_date_goals" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL,
    "shots_missed" INTEGER NOT NULL,
    "shootout_goals" INTEGER NOT NULL,
    "face_offs_won" INTEGER NOT NULL,
    "face_offs_lost" INTEGER NOT NULL,
    "face_off_pct" DOUBLE PRECISION NOT NULL,
    "giveaways" INTEGER NOT NULL,
    "penalties" INTEGER NOT NULL,
    "penalty_minutes" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "skater_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goalie_statistics" (
    "id" TEXT NOT NULL,
    "goals_against" INTEGER NOT NULL,
    "shots_against" INTEGER NOT NULL,
    "shooutout_saves" INTEGER NOT NULL,
    "shooutout_shots_against" INTEGER NOT NULL,
    "saves" INTEGER NOT NULL,
    "save_pct" DOUBLE PRECISION NOT NULL,
    "even_strength_saves" INTEGER NOT NULL,
    "power_play_saves" INTEGER NOT NULL,
    "short_handed_saves" INTEGER NOT NULL,
    "time_on_ice" TEXT NOT NULL,
    "year_to_date_goals" INTEGER NOT NULL,
    "peanlty_minutes" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "goalie_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nhl_statistics_athlete_game_statistic_id_key" ON "nhl_statistics"("athlete_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nhl_statistics_skater_statistic_id_key" ON "nhl_statistics"("skater_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nhl_statistics_goalie_statistic_id_key" ON "nhl_statistics"("goalie_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nhl_statistics_game_id_athlete_id_key" ON "nhl_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "nhl_statistics_game_id_team_id_key" ON "nhl_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "nhl_team_statistics_team_game_statistic_id_key" ON "nhl_team_statistics"("team_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nhl_team_statistics_athlete_total_statistics_id_key" ON "nhl_team_statistics"("athlete_total_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nhl_team_statistics_game_id_team_id_key" ON "nhl_team_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "skater_statistics_game_id_team_id_key" ON "skater_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "skater_statistics_game_id_athlete_id_key" ON "skater_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "goalie_statistics_game_id_team_id_key" ON "goalie_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "goalie_statistics_game_id_athlete_id_key" ON "goalie_statistics"("game_id", "athlete_id");

-- AddForeignKey
ALTER TABLE "nhl_statistics" ADD CONSTRAINT "nhl_statistics_athlete_game_statistic_id_fkey" FOREIGN KEY ("athlete_game_statistic_id") REFERENCES "athlete_game_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_statistics" ADD CONSTRAINT "nhl_statistics_skater_statistic_id_fkey" FOREIGN KEY ("skater_statistic_id") REFERENCES "skater_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_statistics" ADD CONSTRAINT "nhl_statistics_goalie_statistic_id_fkey" FOREIGN KEY ("goalie_statistic_id") REFERENCES "goalie_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_team_statistics" ADD CONSTRAINT "nhl_team_statistics_team_game_statistic_id_fkey" FOREIGN KEY ("team_game_statistic_id") REFERENCES "team_game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_team_statistics" ADD CONSTRAINT "nhl_team_statistics_athlete_total_statistics_id_fkey" FOREIGN KEY ("athlete_total_statistics_id") REFERENCES "nhl_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
