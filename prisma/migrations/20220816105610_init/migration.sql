-- CreateTable
CREATE TABLE "leagues" (
    "id" TEXT NOT NULL,
    "teams_list_url" TEXT NOT NULL,
    "abr" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "depth_chart_url" TEXT,
    "roster_url" TEXT NOT NULL,
    "team_url" TEXT NOT NULL,
    "city" TEXT,
    "name" TEXT,
    "abr" TEXT NOT NULL,
    "img_src" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "injury_status" TEXT,
    "pos" TEXT NOT NULL,
    "depth" INTEGER,
    "position_group" TEXT NOT NULL,
    "wr_set" INTEGER,
    "player_url" TEXT NOT NULL,
    "player_image_src" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "age" TEXT,
    "number" TEXT NOT NULL,
    "player_depth_position" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "league_id" TEXT,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fantasy_pros_data" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "player_name" TEXT NOT NULL,
    "pos" TEXT NOT NULL,
    "bye_week" INTEGER NOT NULL,
    "strength_of_schedule" TEXT NOT NULL,
    "avg_adp" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "avg_fan_points" DOUBLE PRECISION NOT NULL,
    "avg_passing_yards" DOUBLE PRECISION NOT NULL,
    "avg_passing_tds" DOUBLE PRECISION NOT NULL,
    "avg_receiving_rec" DOUBLE PRECISION NOT NULL,
    "avg_receiving_yds" DOUBLE PRECISION NOT NULL,
    "avg_receiving_tds" DOUBLE PRECISION NOT NULL,
    "avg_rushing_att" DOUBLE PRECISION NOT NULL,
    "avg_rushing_yds" DOUBLE PRECISION NOT NULL,
    "avg_rushing_tds" DOUBLE PRECISION NOT NULL,
    "total_fan_points" DOUBLE PRECISION NOT NULL,
    "total_passing_yds" DOUBLE PRECISION NOT NULL,
    "total_passing_tds" DOUBLE PRECISION NOT NULL,
    "total_receiving_rec" DOUBLE PRECISION NOT NULL,
    "total_receiving_yds" DOUBLE PRECISION NOT NULL,
    "total_receiving_tds" DOUBLE PRECISION NOT NULL,
    "total_rushing_att" DOUBLE PRECISION NOT NULL,
    "total_rushing_yds" DOUBLE PRECISION NOT NULL,
    "total_rushing_tds" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "fantasy_pros_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leagues_abr_key" ON "leagues"("abr");

-- CreateIndex
CREATE UNIQUE INDEX "fantasy_pros_data_player_id_key" ON "fantasy_pros_data"("player_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fantasy_pros_data" ADD CONSTRAINT "fantasy_pros_data_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
