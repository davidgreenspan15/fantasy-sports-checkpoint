-- CreateTable
CREATE TABLE "seasons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "display_year" TEXT NOT NULL DEFAULT '2023-24',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leagues" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "short_display_name" TEXT NOT NULL,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "league_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "weight" INTEGER,
    "height" INTEGER,
    "display_height" TEXT,
    "age" INTEGER,
    "date_of_birth" TIMESTAMP(3),
    "birthday" TEXT,
    "slug" TEXT NOT NULL,
    "espn_url" TEXT NOT NULL DEFAULT 'https://www.espn.com',
    "image_url" TEXT,
    "number" TEXT,
    "is_injured" BOOLEAN NOT NULL,
    "injury_status" TEXT,
    "team_id" TEXT,
    "position_id" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "rosterId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rosters" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "season_id" TEXT NOT NULL,
    "season_year_number_and_type" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "rosters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depths" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "league_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "depths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "parent_position_id" TEXT,
    "league_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "week" INTEGER,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "home_team_id" TEXT NOT NULL,
    "away_team_id" TEXT NOT NULL,
    "season_id" TEXT,
    "league_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_statistics" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "game_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_game_statistics" (
    "id" TEXT NOT NULL,
    "game_statistic_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "team_game_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athlete_game_statistics" (
    "id" TEXT NOT NULL,
    "athlete_id" TEXT NOT NULL,
    "game_statistic_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "athlete_game_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfl_statistics" (
    "id" TEXT NOT NULL,
    "athlete_game_statistic_id" TEXT,
    "passing_statistics_id" TEXT NOT NULL,
    "rushing_statistics_id" TEXT NOT NULL,
    "receiving_statistics_id" TEXT NOT NULL,
    "fumble_statistics_id" TEXT NOT NULL,
    "defensive_statistics_id" TEXT NOT NULL,
    "interception_statistics_id" TEXT NOT NULL,
    "kick_return_statistics_id" TEXT NOT NULL,
    "punt_return_statistics_id" TEXT NOT NULL,
    "kicking_statistics_id" TEXT NOT NULL,
    "punting_statistics_id" TEXT NOT NULL,
    "team_id" TEXT,
    "game_id" TEXT NOT NULL,
    "athlete_id" TEXT,

    CONSTRAINT "nfl_statistics_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "nfl_team_statistics" (
    "id" TEXT NOT NULL,
    "first_downs" INTEGER NOT NULL,
    "first_downs_passing" INTEGER NOT NULL,
    "first_downs_rushing" INTEGER NOT NULL,
    "first_downs_penalty" INTEGER NOT NULL,
    "third_down_eff" TEXT NOT NULL,
    "fourth_down_eff" TEXT NOT NULL,
    "total_offensive_plays" INTEGER NOT NULL,
    "total_yards" INTEGER NOT NULL,
    "yards_per_play" DOUBLE PRECISION NOT NULL,
    "total_drives" INTEGER NOT NULL,
    "net_passing_yards" INTEGER NOT NULL,
    "completions_attempts" TEXT NOT NULL,
    "yards_per_pass" DOUBLE PRECISION NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "sacks" INTEGER NOT NULL,
    "sack_yards" INTEGER NOT NULL,
    "rushing_attempts" INTEGER NOT NULL,
    "rushing_yards" INTEGER NOT NULL,
    "yards_per_rush_attempt" DOUBLE PRECISION NOT NULL,
    "red_zone_attempts" INTEGER NOT NULL,
    "red_zone_conversions" INTEGER NOT NULL,
    "total_penalties" INTEGER NOT NULL,
    "total_penalty_yards" INTEGER NOT NULL,
    "turnovers" INTEGER NOT NULL,
    "fumbles_lost" INTEGER NOT NULL,
    "interceptions_thrown" INTEGER NOT NULL,
    "defensive_tds" INTEGER NOT NULL,
    "possession_time" TEXT NOT NULL,
    "team_game_statistic_id" TEXT NOT NULL,
    "athlete_total_statistics_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "nfl_team_statistics_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "passing_statistics" (
    "id" TEXT NOT NULL,
    "completions" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_attempt" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "sacks" INTEGER NOT NULL,
    "sack_yards_lost" INTEGER NOT NULL,
    "adjusted_rating" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "passing_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rushing_statistics" (
    "id" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_attempt" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "rushing_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receiving_statistics" (
    "id" TEXT NOT NULL,
    "receptions" INTEGER NOT NULL,
    "targets" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_reception" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "receiving_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fumble_statistics" (
    "id" TEXT NOT NULL,
    "fumbles" INTEGER NOT NULL,
    "lost" INTEGER NOT NULL,
    "recovered" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "fumble_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defensive_statistics" (
    "id" TEXT NOT NULL,
    "total_tackles" INTEGER NOT NULL,
    "solo_tackles" INTEGER NOT NULL,
    "sacks" DOUBLE PRECISION NOT NULL,
    "tackles_for_loss" DOUBLE PRECISION NOT NULL,
    "passes_defended" INTEGER NOT NULL,
    "qb_hits" INTEGER NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "defensive_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interception_statistics" (
    "id" TEXT NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "interception_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kick_return_statistics" (
    "id" TEXT NOT NULL,
    "returns" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_return" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "kick_return_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "punt_return_statistics" (
    "id" TEXT NOT NULL,
    "returns" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_return" DOUBLE PRECISION NOT NULL,
    "touchdowns" INTEGER NOT NULL,
    "longest" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "punt_return_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kicking_statistics" (
    "id" TEXT NOT NULL,
    "field_goal_attempts" INTEGER NOT NULL,
    "field_goal_made" INTEGER NOT NULL,
    "field_goal_pct" DOUBLE PRECISION NOT NULL,
    "longest" INTEGER NOT NULL,
    "extra_point_attempts" INTEGER NOT NULL,
    "extra_point_made" INTEGER NOT NULL,
    "total_points" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "kicking_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "punting_statistics" (
    "id" TEXT NOT NULL,
    "punts" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "yards_per_punt" DOUBLE PRECISION NOT NULL,
    "longest" INTEGER NOT NULL,
    "punts_inside_20" INTEGER NOT NULL,
    "touchbacks" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "punting_statistics_pkey" PRIMARY KEY ("id")
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
    "even_strength_time_on_ice" TEXT NOT NULL,
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
    "shootout_saves" INTEGER NOT NULL,
    "shootout_shots_against" INTEGER NOT NULL,
    "saves" INTEGER NOT NULL,
    "save_pct" DOUBLE PRECISION NOT NULL,
    "even_strength_saves" INTEGER NOT NULL,
    "power_play_saves" INTEGER NOT NULL,
    "short_handed_saves" INTEGER NOT NULL,
    "time_on_ice" TEXT NOT NULL,
    "year_to_date_goals" INTEGER NOT NULL,
    "penalty_minutes" INTEGER NOT NULL,
    "team_id" TEXT,
    "athlete_id" TEXT,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "goalie_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_athletes" (
    "id" TEXT NOT NULL,
    "player_name" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "bye_week" INTEGER,
    "athlete_id" TEXT,

    CONSTRAINT "fps_athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_average_stats" (
    "id" TEXT NOT NULL,
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
    "fps_athlete_id" TEXT NOT NULL,

    CONSTRAINT "fps_average_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_total_stats" (
    "id" TEXT NOT NULL,
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
    "fps_athlete_id" TEXT NOT NULL,

    CONSTRAINT "fps_total_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_ranks" (
    "id" TEXT NOT NULL,
    "tiers" INTEGER NOT NULL,
    "best" INTEGER NOT NULL,
    "worst" INTEGER NOT NULL,
    "avg" DOUBLE PRECISION NOT NULL,
    "std_dev" DOUBLE PRECISION NOT NULL,
    "ecr_vs_adp" DOUBLE PRECISION NOT NULL,
    "fps_athlete_id" TEXT NOT NULL,

    CONSTRAINT "fps_ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_notes" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fps_athlete_id" TEXT NOT NULL,

    CONSTRAINT "fps_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fps_overviews" (
    "id" TEXT NOT NULL,
    "strength_of_schedule" DOUBLE PRECISION NOT NULL,
    "ecr_vs_adp" DOUBLE PRECISION NOT NULL,
    "average_points" DOUBLE PRECISION NOT NULL,
    "percentage_games" TEXT NOT NULL,
    "fps_athlete_id" TEXT NOT NULL,

    CONSTRAINT "fps_overviews_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "fantasy_pros_data" (
    "id" TEXT NOT NULL,
    "player_id" TEXT,
    "rank" INTEGER NOT NULL,
    "player_name" TEXT NOT NULL,
    "team_abr" TEXT NOT NULL,
    "pos" TEXT NOT NULL,
    "bye_week" INTEGER,
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

-- CreateTable
CREATE TABLE "_AthleteToDepth" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DepthToPosition" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GameToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ScrapedGameToScrapedTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "leagues_sport_espn_id_key" ON "leagues"("sport", "espn_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_uid_key" ON "teams"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "teams_espn_id_league_id_key" ON "teams"("espn_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_uid_key" ON "athletes"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_guid_key" ON "athletes"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_espn_id_league_id_key" ON "athletes"("espn_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "rosters_team_id_league_id_season_year_number_and_type_key" ON "rosters"("team_id", "league_id", "season_year_number_and_type");

-- CreateIndex
CREATE UNIQUE INDEX "depths_espn_id_league_id_depth_key" ON "depths"("espn_id", "league_id", "depth");

-- CreateIndex
CREATE UNIQUE INDEX "positions_espn_id_league_id_key" ON "positions"("espn_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "games_espn_id_league_id_key" ON "games"("espn_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_statistics_game_id_key" ON "game_statistics"("game_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_game_statistics_game_id_team_id_key" ON "team_game_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_game_statistics_game_statistic_id_team_id_key" ON "team_game_statistics"("game_statistic_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "athlete_game_statistics_game_statistic_id_athlete_id_key" ON "athlete_game_statistics"("game_statistic_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_athlete_game_statistic_id_key" ON "nfl_statistics"("athlete_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_passing_statistics_id_key" ON "nfl_statistics"("passing_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_rushing_statistics_id_key" ON "nfl_statistics"("rushing_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_receiving_statistics_id_key" ON "nfl_statistics"("receiving_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_fumble_statistics_id_key" ON "nfl_statistics"("fumble_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_defensive_statistics_id_key" ON "nfl_statistics"("defensive_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_interception_statistics_id_key" ON "nfl_statistics"("interception_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_kick_return_statistics_id_key" ON "nfl_statistics"("kick_return_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_punt_return_statistics_id_key" ON "nfl_statistics"("punt_return_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_kicking_statistics_id_key" ON "nfl_statistics"("kicking_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_punting_statistics_id_key" ON "nfl_statistics"("punting_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_game_id_athlete_id_key" ON "nfl_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_statistics_game_id_team_id_key" ON "nfl_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_statistics_athlete_game_statistic_id_key" ON "nba_statistics"("athlete_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_statistics_basketball_statistic_id_key" ON "nba_statistics"("basketball_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_statistics_game_id_athlete_id_key" ON "nba_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_statistics_game_id_team_id_key" ON "nba_statistics"("game_id", "team_id");

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
CREATE UNIQUE INDEX "nfl_team_statistics_team_game_statistic_id_key" ON "nfl_team_statistics"("team_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_team_statistics_athlete_total_statistics_id_key" ON "nfl_team_statistics"("athlete_total_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfl_team_statistics_game_id_team_id_key" ON "nfl_team_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_team_statistics_team_game_statistic_id_key" ON "nba_team_statistics"("team_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_team_statistics_athlete_total_statistics_id_key" ON "nba_team_statistics"("athlete_total_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nba_team_statistics_game_id_team_id_key" ON "nba_team_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "nhl_team_statistics_team_game_statistic_id_key" ON "nhl_team_statistics"("team_game_statistic_id");

-- CreateIndex
CREATE UNIQUE INDEX "nhl_team_statistics_athlete_total_statistics_id_key" ON "nhl_team_statistics"("athlete_total_statistics_id");

-- CreateIndex
CREATE UNIQUE INDEX "nhl_team_statistics_game_id_team_id_key" ON "nhl_team_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "passing_statistics_game_id_team_id_key" ON "passing_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "passing_statistics_game_id_athlete_id_key" ON "passing_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "rushing_statistics_game_id_team_id_key" ON "rushing_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "rushing_statistics_game_id_athlete_id_key" ON "rushing_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "receiving_statistics_game_id_team_id_key" ON "receiving_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "receiving_statistics_game_id_athlete_id_key" ON "receiving_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fumble_statistics_game_id_team_id_key" ON "fumble_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "fumble_statistics_game_id_athlete_id_key" ON "fumble_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "defensive_statistics_game_id_team_id_key" ON "defensive_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "defensive_statistics_game_id_athlete_id_key" ON "defensive_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "interception_statistics_game_id_team_id_key" ON "interception_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "interception_statistics_game_id_athlete_id_key" ON "interception_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "kick_return_statistics_game_id_team_id_key" ON "kick_return_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "kick_return_statistics_game_id_athlete_id_key" ON "kick_return_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "punt_return_statistics_game_id_team_id_key" ON "punt_return_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "punt_return_statistics_game_id_athlete_id_key" ON "punt_return_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "kicking_statistics_game_id_team_id_key" ON "kicking_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "kicking_statistics_game_id_athlete_id_key" ON "kicking_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "punting_statistics_game_id_team_id_key" ON "punting_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "punting_statistics_game_id_athlete_id_key" ON "punting_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "basketball_statistics_game_id_team_id_key" ON "basketball_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "basketball_statistics_game_id_athlete_id_key" ON "basketball_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "skater_statistics_game_id_team_id_key" ON "skater_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "skater_statistics_game_id_athlete_id_key" ON "skater_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "goalie_statistics_game_id_team_id_key" ON "goalie_statistics"("game_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "goalie_statistics_game_id_athlete_id_key" ON "goalie_statistics"("game_id", "athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_athletes_athlete_id_key" ON "fps_athletes"("athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_athletes_player_name_team_key" ON "fps_athletes"("player_name", "team");

-- CreateIndex
CREATE UNIQUE INDEX "fps_average_stats_fps_athlete_id_key" ON "fps_average_stats"("fps_athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_total_stats_fps_athlete_id_key" ON "fps_total_stats"("fps_athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_ranks_fps_athlete_id_key" ON "fps_ranks"("fps_athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_notes_fps_athlete_id_key" ON "fps_notes"("fps_athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "fps_overviews_fps_athlete_id_key" ON "fps_overviews"("fps_athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "scraped_leagues_abr_key" ON "scraped_leagues"("abr");

-- CreateIndex
CREATE UNIQUE INDEX "scraped_players_league_id_espn_player_id_name_key" ON "scraped_players"("league_id", "espn_player_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "fantasy_pros_data_player_id_key" ON "fantasy_pros_data"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "_AthleteToDepth_AB_unique" ON "_AthleteToDepth"("A", "B");

-- CreateIndex
CREATE INDEX "_AthleteToDepth_B_index" ON "_AthleteToDepth"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DepthToPosition_AB_unique" ON "_DepthToPosition"("A", "B");

-- CreateIndex
CREATE INDEX "_DepthToPosition_B_index" ON "_DepthToPosition"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GameToTeam_AB_unique" ON "_GameToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToTeam_B_index" ON "_GameToTeam"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ScrapedGameToScrapedTeam_AB_unique" ON "_ScrapedGameToScrapedTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_ScrapedGameToScrapedTeam_B_index" ON "_ScrapedGameToScrapedTeam"("B");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_rosterId_fkey" FOREIGN KEY ("rosterId") REFERENCES "rosters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rosters" ADD CONSTRAINT "rosters_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rosters" ADD CONSTRAINT "rosters_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rosters" ADD CONSTRAINT "rosters_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depths" ADD CONSTRAINT "depths_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_statistics" ADD CONSTRAINT "game_statistics_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_statistics" ADD CONSTRAINT "team_game_statistics_game_statistic_id_fkey" FOREIGN KEY ("game_statistic_id") REFERENCES "game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_statistics" ADD CONSTRAINT "team_game_statistics_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_game_statistics" ADD CONSTRAINT "athlete_game_statistics_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_game_statistics" ADD CONSTRAINT "athlete_game_statistics_game_statistic_id_fkey" FOREIGN KEY ("game_statistic_id") REFERENCES "game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_athlete_game_statistic_id_fkey" FOREIGN KEY ("athlete_game_statistic_id") REFERENCES "athlete_game_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_passing_statistics_id_fkey" FOREIGN KEY ("passing_statistics_id") REFERENCES "passing_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_rushing_statistics_id_fkey" FOREIGN KEY ("rushing_statistics_id") REFERENCES "rushing_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_receiving_statistics_id_fkey" FOREIGN KEY ("receiving_statistics_id") REFERENCES "receiving_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_fumble_statistics_id_fkey" FOREIGN KEY ("fumble_statistics_id") REFERENCES "fumble_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_defensive_statistics_id_fkey" FOREIGN KEY ("defensive_statistics_id") REFERENCES "defensive_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_interception_statistics_id_fkey" FOREIGN KEY ("interception_statistics_id") REFERENCES "interception_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_kick_return_statistics_id_fkey" FOREIGN KEY ("kick_return_statistics_id") REFERENCES "kick_return_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_punt_return_statistics_id_fkey" FOREIGN KEY ("punt_return_statistics_id") REFERENCES "punt_return_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_kicking_statistics_id_fkey" FOREIGN KEY ("kicking_statistics_id") REFERENCES "kicking_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_statistics" ADD CONSTRAINT "nfl_statistics_punting_statistics_id_fkey" FOREIGN KEY ("punting_statistics_id") REFERENCES "punting_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nba_statistics" ADD CONSTRAINT "nba_statistics_athlete_game_statistic_id_fkey" FOREIGN KEY ("athlete_game_statistic_id") REFERENCES "athlete_game_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nba_statistics" ADD CONSTRAINT "nba_statistics_basketball_statistic_id_fkey" FOREIGN KEY ("basketball_statistic_id") REFERENCES "basketball_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_statistics" ADD CONSTRAINT "nhl_statistics_athlete_game_statistic_id_fkey" FOREIGN KEY ("athlete_game_statistic_id") REFERENCES "athlete_game_statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_statistics" ADD CONSTRAINT "nhl_statistics_skater_statistic_id_fkey" FOREIGN KEY ("skater_statistic_id") REFERENCES "skater_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_statistics" ADD CONSTRAINT "nhl_statistics_goalie_statistic_id_fkey" FOREIGN KEY ("goalie_statistic_id") REFERENCES "goalie_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_team_statistics" ADD CONSTRAINT "nfl_team_statistics_team_game_statistic_id_fkey" FOREIGN KEY ("team_game_statistic_id") REFERENCES "team_game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfl_team_statistics" ADD CONSTRAINT "nfl_team_statistics_athlete_total_statistics_id_fkey" FOREIGN KEY ("athlete_total_statistics_id") REFERENCES "nfl_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nba_team_statistics" ADD CONSTRAINT "nba_team_statistics_team_game_statistic_id_fkey" FOREIGN KEY ("team_game_statistic_id") REFERENCES "team_game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nba_team_statistics" ADD CONSTRAINT "nba_team_statistics_athlete_total_statistics_id_fkey" FOREIGN KEY ("athlete_total_statistics_id") REFERENCES "nba_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_team_statistics" ADD CONSTRAINT "nhl_team_statistics_team_game_statistic_id_fkey" FOREIGN KEY ("team_game_statistic_id") REFERENCES "team_game_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhl_team_statistics" ADD CONSTRAINT "nhl_team_statistics_athlete_total_statistics_id_fkey" FOREIGN KEY ("athlete_total_statistics_id") REFERENCES "nhl_statistics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_athletes" ADD CONSTRAINT "fps_athletes_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_average_stats" ADD CONSTRAINT "fps_average_stats_fps_athlete_id_fkey" FOREIGN KEY ("fps_athlete_id") REFERENCES "fps_athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_total_stats" ADD CONSTRAINT "fps_total_stats_fps_athlete_id_fkey" FOREIGN KEY ("fps_athlete_id") REFERENCES "fps_athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_ranks" ADD CONSTRAINT "fps_ranks_fps_athlete_id_fkey" FOREIGN KEY ("fps_athlete_id") REFERENCES "fps_athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_notes" ADD CONSTRAINT "fps_notes_fps_athlete_id_fkey" FOREIGN KEY ("fps_athlete_id") REFERENCES "fps_athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fps_overviews" ADD CONSTRAINT "fps_overviews_fps_athlete_id_fkey" FOREIGN KEY ("fps_athlete_id") REFERENCES "fps_athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped_teams" ADD CONSTRAINT "scraped_teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "scraped_leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped_players" ADD CONSTRAINT "scraped_players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "scraped_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped_players" ADD CONSTRAINT "scraped_players_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "scraped_leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fantasy_pros_data" ADD CONSTRAINT "fantasy_pros_data_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "scraped_players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AthleteToDepth" ADD CONSTRAINT "_AthleteToDepth_A_fkey" FOREIGN KEY ("A") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AthleteToDepth" ADD CONSTRAINT "_AthleteToDepth_B_fkey" FOREIGN KEY ("B") REFERENCES "depths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepthToPosition" ADD CONSTRAINT "_DepthToPosition_A_fkey" FOREIGN KEY ("A") REFERENCES "depths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepthToPosition" ADD CONSTRAINT "_DepthToPosition_B_fkey" FOREIGN KEY ("B") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToTeam" ADD CONSTRAINT "_GameToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToTeam" ADD CONSTRAINT "_GameToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScrapedGameToScrapedTeam" ADD CONSTRAINT "_ScrapedGameToScrapedTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "scraped_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScrapedGameToScrapedTeam" ADD CONSTRAINT "_ScrapedGameToScrapedTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "scraped_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
