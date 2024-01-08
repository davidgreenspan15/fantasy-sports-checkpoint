export type FPSData =
  | FPSOverviewData
  | FPSAverageStatData
  | FPSRankData
  | FPSNoteData
  | FPSTotalStatData;

export interface FPSOverviewData {
  rk: string;
  tiers: string;
  player_name: string;
  team: string;
  pos: string;
  bye_week: string;
  strength_of_schedule_: string;
  "ecr_vs._adp": string;
  "avg._points_": string;
  "%_games_": string;
}

export interface FPSAverageStatData {
  rk: string;
  tiers: string;
  player_name: string;
  team: string;
  fan_pts: string;
  pass_yds: string;
  pass_tds: string;
  rec: string;
  rec_yds: string;
  rec_tds: string;
  att: string;
  rush_yds: string;
  rush_tds: string;
}

export interface FPSRankData {
  rk: string;
  tiers: string;
  player_name: string;
  team: string;
  pos: string;
  bye_week: string;
  best: string;
  worst: string;
  avg: string;
  "std.dev": string;
  "ecr_vs._adp": string;
}

export interface FPSNoteData {
  rk: string;
  tiers: string;
  player_name: string;
  team: string;
  pos: string;
  bye_week: string;
  notes: string;
}

export interface FPSTotalStatData {
  rk: string;
  tiers: string;
  player_name: string;
  team: string;
  fan_pts: string;
  pass_yds: string;
  pass_tds: string;
  rec: string;
  rec_yds: string;
  rec_tds: string;
  att: string;
  rush_yds: string;
  rush_tds: string;
}
