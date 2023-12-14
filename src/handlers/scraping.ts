import { ScrapedTeam } from "@prisma/client";

import { getScrapedLeagues } from "../models/scrapedLeagues";
import {
  createScrapedTeams,
  listScrapedTeams,
  listScrapedTeamsWithPlayersAndLeague,
} from "../models/scrapedTeams";
import { scrapeRequestBuilder } from "../services/scraping/requestBuilder";
import {
  createScrapedPlayers,
  listScrapedLeaguesPlayers,
  updateScrapedPlayers,
} from "../models/scrapedPlayers";
import { createScrapedGames } from "../models/scrapedGames";

export const scrapeTeams = async () => {
  const teams: ScrapedTeam[] = [];
  const leagues = await getScrapedLeagues();
  const l = await Promise.all(
    leagues.map(async (l) => {
      await scrapeRequestBuilder.scrapeTeamListRequest(l);
      return l;
    })
  );
  l.forEach((l) => teams.push(...l.teams));
  const count = createScrapedTeams(teams);
  return { count, teams };
};

export const scrapePlayers = async () => {
  const teams = await listScrapedTeamsWithPlayersAndLeague();

  const players = [];
  const response = await Promise.all(
    teams.map(async (team) => {
      await scrapeRequestBuilder.scrapeRosterRequest(team);
      team;
      if (team.depthChartUrl) {
        await scrapeRequestBuilder.scrapeDepthChartRequest(team);
      }
      return team;
    })
  );
  teams.forEach((l) => players.push(...l.players));
  teams.map((t) => (t.players = []));
  const count = await createScrapedPlayers(players);
  return { count, players };
};

export const scrapeGames = async () => {
  const teams = await listScrapedTeams();
  const response = await Promise.all(
    teams.map(async (t) => {
      const res = await scrapeRequestBuilder.scrapeTeamGamesRequest(t, teams);
      return res;
    })
  );
  const teamGames = response.flat();
  const games = await createScrapedGames(teamGames);

  return { count: games, teamGames };
};

export const scrapeBirthdays = async () => {
  const players = await listScrapedLeaguesPlayers(["nfl"]);
  const response = await Promise.all(
    players.slice(0, 100).map(async (p) => {
      const res = await scrapeRequestBuilder.scrapeMorePlayerInfo(p);
      return res;
    })
  );
  return await updateScrapedPlayers(response);
};
