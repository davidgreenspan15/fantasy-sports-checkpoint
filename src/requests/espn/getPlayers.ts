import { Team, Player } from '@prisma/client';
import { Workflow } from '../..';
import { getRosters } from './getRosters';
import { getTeamDepthChart } from './getTeamDepthChart';

export const getPlayers: (
  teams: (Team & {
    players: Player[];
  })[]
) => Promise<{ teams: Team[]; players: Player[] }> = async teams => {
  const players = [];
  const response = await Promise.all(
    teams.map(async team => {
      await getRosters(team);
      if (team.depthChartUrl) {
        await getTeamDepthChart(team);
      }
      return team;
    })
  );
  teams.forEach(l => players.push(...l.players));
  teams.map(t => (t.players = []));
  console.debug({ players });
  return { teams, players };
};
