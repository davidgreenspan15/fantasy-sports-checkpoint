import { ScrapedLeague, ScrapedPlayer, ScrapedTeam } from "@prisma/client";
import { scrapeRosters } from "./scrapeRosters";
import { scrapeTeamDepthChart } from "./scrapeTeamDepthChart";

export const scrapePlayers: (
  teams: (ScrapedTeam & {
    league: ScrapedLeague;
    players: ScrapedPlayer[];
  })[]
) => Promise<{ teams: ScrapedTeam[]; players: ScrapedPlayer[] }> = async (
  teams
) => {
  const players = [];
  const response = await Promise.all(
    teams.map(async (team) => {
      await scrapeRosters(team);
      if (team.depthChartUrl) {
        await scrapeTeamDepthChart(team);
      }
      return team;
    })
  );
  teams.forEach((l) => players.push(...l.players));
  teams.map((t) => (t.players = []));
  return { teams, players };
};
