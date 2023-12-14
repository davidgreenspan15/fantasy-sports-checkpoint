import { League, Prisma, Team } from "@prisma/client";
import { EspnApiV2 } from "../types/EspnApiV2/espnApiV2";
import { EspnError, isEspnApiRequestError } from "./espnRequestBuilder";

export const espnResponseHandler = {
  handleSportsTeamsResponse: (
    sportTeamListResponses: {
      sports: EspnApiV2.SportTeamsListResponse;
      leagueId: string;
    }[]
  ) => {
    const teams: Prisma.TeamCreateInput[] = [];
    sportTeamListResponses.forEach((str) => {
      const sport = str.sports.sports[0];
      const league = sport.leagues[0];
      console.log(sport, league);

      return league.teams.forEach((t) => {
        const team = createTeam(t.team, str.leagueId);
        teams.push(team);
      });
    });
    console.log(teams[0]);
    return teams;
  },
};

const createTeam: (
  team: EspnApiV2.ResponseSportTeamList.TeamTeam,
  leagueId: string
) => Prisma.TeamCreateInput = (team, leagueId) => {
  return {
    league: { connect: { id: leagueId } },
    espnId: team.id,
    slug: team.slug,
    abbreviation: team.abbreviation,
    displayName: team.displayName,
    shortDisplayName: team.shortDisplayName,
    name: team.name,
    nickname: team.nickname,
    location: team.location,
    isActive: team.isActive,
    uid: team.uid,
  };
};
