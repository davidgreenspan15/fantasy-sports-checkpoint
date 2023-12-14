import { League, Prisma, Team } from "@prisma/client";
import { EspnApiV2 } from "../../types/EspnApiV2/espnApiV2";
import { EspnError, isEspnApiRequestError } from "./requestBuilder";

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

      return league.teams.forEach((t) => {
        const team = createTeam(t.team, str.leagueId);
        teams.push(team);
      });
    });
    return teams;
  },
  handleScheduleResponse: (
    scheduleResponse: {
      schedule: EspnApiV2.TeamScheduleResponse;
      teamId: string;
      leagueId: string;
    }[]
  ) => {
    const teamsGames: Prisma.TeamGameCreateInput[] = [];
    scheduleResponse.forEach((sr) => {
      const espnTeamId = sr.schedule.team.id;
      sr.schedule.events.forEach((e) => {
        const teamGame = createTeamGame(e, sr.teamId, sr.leagueId, espnTeamId);
        teamsGames.push(teamGame);
      });
    });
    return teamsGames;
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

const createTeamGame: (
  event: EspnApiV2.ResponseTeamSchedule.Event,
  teamId: string,
  leagueId: string,
  espnTeamId: string
) => Prisma.TeamGameCreateInput = (event, teamId, leagueId, espnTeamId) => {
  const isHome =
    event.competitions[0].competitors.find((c) => c.id === espnTeamId)
      ?.homeAway === "home";

  return {
    isHome,
    game: {
      connectOrCreate: {
        where: {
          leagueId_espnId: { leagueId: leagueId, espnId: event.id },
        },
        create: {
          espnId: event.id,
          date: new Date(event.date),
          name: event.name,
          shortName: event.shortName,
          week: event.week.number,
          leagueId: leagueId,
        },
      },
    },
    team: { connect: { id: teamId } },
  };
};
