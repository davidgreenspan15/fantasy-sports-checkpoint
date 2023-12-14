import { Prisma } from "@prisma/client";

import { EspnApiV2 } from "../../types/EspnApiV2/espnApiV2";

export const espnResponseHandler = {
  handleSportsTeamsResponse: (
    sportTeamListResponses: {
      teamSports: EspnApiV2.TeamListResponse;
      leagueId: string;
    }[]
  ) => {
    const teams: Prisma.TeamCreateInput[] = [];
    sportTeamListResponses.forEach((str) => {
      const sport = str.teamSports.sports[0];
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
  handleTeamRosterResponse: (
    rosterResponse: {
      roster: EspnApiV2.TeamRosterResponse;
      teamId: string;
      leagueId: string;
    }[]
  ) => {
    const teamAthletes: Prisma.AthleteCreateInput[] = [];
    const parentPositions: Prisma.PositionCreateInput[][] = [];

    rosterResponse.forEach((sr) => {
      sr.roster.athletes.forEach((a) => {
        a.items.forEach((i) => {
          const { teamAthlete, positions } = createTeamAthlete(
            i,
            sr.teamId,
            sr.leagueId
          );
          teamAthletes.push(teamAthlete);
          if (positions) {
            parentPositions.push(positions);
          }
        });
      });
    });
    return { teamAthletes, parentPositions: parentPositions.flat() };
  },
};

const createTeam: (
  team: EspnApiV2.ResponseTeamList.TeamTeam,
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

const createTeamAthlete: (
  athlete: EspnApiV2.ResponseTeamRoster.Item,
  teamId: string,
  leagueId: string
) => {
  teamAthlete: Prisma.AthleteCreateInput;
  positions: Prisma.PositionCreateInput[];
} = (athlete, teamId, leagueId) => {
  const isInjured = true; //TBD
  const positions: Prisma.PositionCreateInput[] = [];
  const parent = athlete.position.parent;
  const dob = new Date(athlete.dateOfBirth);
  const teamAthlete = {
    team: { connect: { id: teamId } },
    league: { connect: { id: leagueId } },
    uid: athlete.uid,
    guid: athlete.guid,
    espnId: athlete.id,
    firstName: athlete.firstName,
    lastName: athlete.lastName,
    fullName: athlete.fullName,
    displayName: athlete.displayName,
    shortName: athlete.shortName,
    displayHeight: athlete.displayHeight,
    height: athlete.height,
    weight: athlete.weight,
    age: athlete.age,
    dateOfBirth: dob,
    birthday: `${dob.getMonth() + 1}/${dob.getDate()}/${dob.getFullYear()}`,
    slug: athlete.slug,
    number: athlete.jersey,
    isInjured: isInjured,
    injuryStatus: "isInjured",
    position: {
      connect: {
        espnId_leagueId: { espnId: athlete.position.id, leagueId: leagueId },
      },
    },
  };

  positions.push(createPosition(athlete.position, leagueId));
  if (parent) {
    positions.push(createPosition(parent, leagueId));
  }

  return { teamAthlete, positions };
};

const createPosition: (
  espnPosition: EspnApiV2.ResponseTeamRoster.Position,
  leagueId: string
) => Prisma.PositionCreateInput = (espnPosition, leagueId) => {
  return {
    espnId: espnPosition.id,
    name: espnPosition.name,
    displayName: espnPosition.displayName,
    abbreviation: espnPosition.abbreviation,
    parentPositionId: espnPosition.parent?.id,
    league: { connect: { id: leagueId } },
  };
};
