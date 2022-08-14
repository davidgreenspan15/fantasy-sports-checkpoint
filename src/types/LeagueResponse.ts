import { Workflow } from '..';
import { Teams } from './Teams';

export type Leagues = League[];

export interface LeaguesResponse {
  leagues: Leagues;
  workflow: Workflow;
}

export interface League {
  name: string;
  depthChartListUrl: string;
  teams: Teams;
}
