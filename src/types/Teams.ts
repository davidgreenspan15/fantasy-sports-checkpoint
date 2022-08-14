import { Workflow } from '..';
import { AllPlayers } from './Players';

export type Teams = Team[];

export interface Team {
  depthChartUrl: string;
  rosterUrl: string;
  city?: string;
  name?: string;
  abr: string;
  imgSrc?: string;
  players: AllPlayers;
}

export interface TeamResponse {
  team: Team;
  workflow: Workflow;
}
