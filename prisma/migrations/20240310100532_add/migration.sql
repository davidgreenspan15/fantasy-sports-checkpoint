-- CreateTable
CREATE TABLE "mlb_statistics" (
    "id" TEXT NOT NULL,
    "athlete_game_statistic_id" TEXT,
    "team_id" TEXT,
    "game_id" TEXT NOT NULL,
    "athlete_id" TEXT,

    CONSTRAINT "mlb_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mlb_team_statistics" (
    "id" TEXT NOT NULL,
    "team_game_statistic_id" TEXT NOT NULL,
    "athlete_total_statistics_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "mlb_team_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batter_statistics" (
    "id" TEXT NOT NULL,
    "at_bats" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "rbi" INTEGER NOT NULL,
    "home_runs" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "pitches_seen" INTEGER NOT NULL,
    "batting_average" DOUBLE PRECISION NOT NULL,
    "on_base_percentage" DOUBLE PRECISION NOT NULL,
    "slugging_percentage" DOUBLE PRECISION NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,
    "mlbAthleteStatisticId" TEXT,

    CONSTRAINT "batter_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitcher_statistics" (
    "id" TEXT NOT NULL,
    "innings_pitched" DOUBLE PRECISION NOT NULL,
    "hits_allowed" INTEGER NOT NULL,
    "runs_allowed" INTEGER NOT NULL,
    "earned_runs" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "home_runs_allowed" INTEGER NOT NULL,
    "strikes" INTEGER NOT NULL,
    "era" DOUBLE PRECISION NOT NULL,
    "pitches_thrown" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,
    "mlbAthleteStatisticId" TEXT,

    CONSTRAINT "pitcher_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mlb_statistics_athlete_game_statistic_id_key" ON "mlb_statistics"("athlete_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "mlb_statistics_game_id_athlete_id_key" ON "mlb_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "mlb_statistics_game_id_team_id_key" ON "mlb_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "mlb_team_statistics_team_game_statistic_id_key" ON "mlb_team_statistics"("team_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "mlb_team_statistics_athlete_total_statistics_id_key" ON "mlb_team_statistics"("athlete_total_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "mlb_team_statistics_game_id_team_id_key" ON "mlb_team_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "batter_statistics_game_id_team_id_key" ON "batter_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "batter_statistics_game_id_athlete_id_key" ON "batter_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "pitcher_statistics_game_id_team_id_key" ON "pitcher_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "pitcher_statistics_game_id_athlete_id_key" ON "pitcher_statistics"("game_id", "athlete_id");

-- AddForeignKey
ALTER TABLE "mlb_statistics" ADD CONSTRAINT "mlb_statistics_athlete_game_statistic_id_fkey" FOREIGN KEY ("athlete_game_statistic_id") REFERENCES "athlete_game_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mlb_team_statistics" ADD CONSTRAINT "mlb_team_statistics_team_game_statistic_id_fkey" FOREIGN KEY ("team_game_statistic_id") REFERENCES "team_game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mlb_team_statistics" ADD CONSTRAINT "mlb_team_statistics_athlete_total_statistics_id_fkey" FOREIGN KEY ("athlete_total_statistics_id") REFERENCES "mlb_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batter_statistics" ADD CONSTRAINT "batter_statistics_mlbAthleteStatisticId_fkey" FOREIGN KEY ("mlbAthleteStatisticId") REFERENCES "mlb_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitcher_statistics" ADD CONSTRAINT "pitcher_statistics_mlbAthleteStatisticId_fkey" FOREIGN KEY ("mlbAthleteStatisticId") REFERENCES "mlb_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
