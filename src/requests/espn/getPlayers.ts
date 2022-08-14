import { Workflow } from '../..';
import { Team } from '../../types/Teams';
import { getRosters } from './getRosters';
import { getTeamDepthChart } from './getTeamDepthChart';

export const getPlayers: (
  team: Team,
  workflow: Workflow
) => Promise<Team> = async team => {
  team = await getRosters(team);
  team = await getTeamDepthChart(team);
  return team;
};
