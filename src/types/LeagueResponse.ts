import { League, Team } from '@prisma/client';
import { Workflow } from '..';
import { Teams } from './Teams';

// export type Leagues = League[];

export interface LeaguesResponse {
  leagues: (League & {
    teams: Team[];
  })[];
}

// export interface League {
//   name: string;
//   depthChartListUrl: string;
//   teams: Teams;
// }
