-- CreateTable
CREATE TABLE "fps_athletes" (
    "id" TEXT NOT NULL,
    "player_name" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "bye_week" INTEGER NOT NULL,
    "athlete_id" TEXT,
    "average_stats_id" TEXT,
    "total_stats_id" TEXT,
    "rank_id" TEXT,
    "note_id" TEXT,
    "overview_id" TEXT,

    CONSTRAINT "fps_athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_average_stats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "tiers" INTEGER NOT NULL,
    "fan_pts" DOUBLE PRECISION NOT NULL,
    "yards_passing" DOUBLE PRECISION NOT NULL,
    "tds_passing" DOUBLE PRECISION NOT NULL,
    "rec" INTEGER NOT NULL,
    "yards_receiving" DOUBLE PRECISION NOT NULL,
    "tds_receiving" DOUBLE PRECISION NOT NULL,
    "att" INTEGER NOT NULL,
    "yards_rushing" DOUBLE PRECISION NOT NULL,
    "tds_rushing" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "fps_average_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_total_stats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "tiers" INTEGER NOT NULL,
    "fan_pts" DOUBLE PRECISION NOT NULL,
    "yards_passing" DOUBLE PRECISION NOT NULL,
    "tds_passing" DOUBLE PRECISION NOT NULL,
    "rec" INTEGER NOT NULL,
    "yards_receiving" DOUBLE PRECISION NOT NULL,
    "tds_receiving" DOUBLE PRECISION NOT NULL,
    "att" INTEGER NOT NULL,
    "yards_rushing" DOUBLE PRECISION NOT NULL,
    "tds_rushing" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "fps_total_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_ranks" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "tiers" INTEGER NOT NULL,
    "best" INTEGER NOT NULL,
    "worst" INTEGER NOT NULL,
    "avg" DOUBLE PRECISION NOT NULL,
    "std_dev" DOUBLE PRECISION NOT NULL,
    "ecr_vs_adp" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "fps_ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_notes" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "fps_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_overviews" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "strength_of_schedule" DOUBLE PRECISION NOT NULL,
    "ecr_vs_adp" DOUBLE PRECISION NOT NULL,
    "average_points" DOUBLE PRECISION NOT NULL,
    "percentage_games" TEXT NOT NULL,

    CONSTRAINT "fps_overviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fps_athletes_athlete_id_key" ON "fps_athletes"("athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_athletes_average_stats_id_key" ON "fps_athletes"("average_stats_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_athletes_total_stats_id_key" ON "fps_athletes"("total_stats_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_athletes_rank_id_key" ON "fps_athletes"("rank_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_athletes_note_id_key" ON "fps_athletes"("note_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_athletes_overview_id_key" ON "fps_athletes"("overview_id");

-- AddForeignKey
ALTER TABLE "fps_athletes" ADD CONSTRAINT "fps_athletes_average_stats_id_fkey" FOREIGN KEY ("average_stats_id") REFERENCES "fps_average_stats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_athletes" ADD CONSTRAINT "fps_athletes_total_stats_id_fkey" FOREIGN KEY ("total_stats_id") REFERENCES "fps_total_stats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_athletes" ADD CONSTRAINT "fps_athletes_rank_id_fkey" FOREIGN KEY ("rank_id") REFERENCES "fps_ranks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_athletes" ADD CONSTRAINT "fps_athletes_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "fps_notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_athletes" ADD CONSTRAINT "fps_athletes_overview_id_fkey" FOREIGN KEY ("overview_id") REFERENCES "fps_overviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_athletes" ADD CONSTRAINT "fps_athletes_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
