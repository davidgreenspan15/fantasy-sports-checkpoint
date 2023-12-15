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
        a.items?.forEach((i) => {
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
  handleTeamDepthResponse: (
    depthChartResponse: {
      depths: EspnApiV2.TeamDepthChartResponse;
      teamId: string;
      leagueId: string;
    }[]
  ) => {
    const depths: Prisma.DepthCreateInput[][] = [];

    depthChartResponse.forEach((sr) => {
      sr.depths.items.forEach((i) => {
        const depth = createDepth(i, sr.leagueId);
        depths.push(depth);
      });
    });
    return depths.flat();
  },
  handleAthleteUrlListResponse: (
    athleteUrlsResponse: {
      athleteUrl: EspnApiV2.LeagueAthleteUrlListResponse[];
    }[],
    leagueWithAthleteEspnIds: ({
      athletes: {
        espnId: string;
      }[];
    } & {
      id: string;
      espnId: string;
      name: string;
      shortName: string;
      abbreviation: string;
      slug: string;
      sport: string;
      createdAt: Date;
      updatedAt: Date;
    })[]
  ) => {
    const nonSavedAthleteUrls: { leagueId: string; athleteUrl: string }[] = [];
    athleteUrlsResponse.forEach((aur) => {
      aur.athleteUrl.forEach((a) => {
        a.items.forEach((athlete) => {
          const splitRef = athlete.$ref.split("/");
          const refSlug = splitRef[7];
          const espnId = splitRef[splitRef.length - 1].split("?")[0];
          const league = leagueWithAthleteEspnIds.find((l) => {
            return l.slug === refSlug;
          });
          const isSaved = league?.athletes.find((aEId) => {
            return aEId.espnId === espnId;
          });

          if (league && !isSaved) {
            nonSavedAthleteUrls.push({
              athleteUrl: athlete.$ref,
              leagueId: league?.id,
            });
          } else {
          }
        });
      });
    });
    return nonSavedAthleteUrls;
  },
  handleLeagueAthleteResponse: (
    leagueAthleteResponse: {
      athlete: EspnApiV2.LeagueAthleteResponse;
      leagueId: string;
    }[]
  ) => {
    const athletes: Prisma.AthleteCreateInput[] = [];
    const positions: Prisma.PositionCreateInput[] = [];

    leagueAthleteResponse.forEach((sr) => {
      const { teamAthlete, position } = createLeagueAthlete(
        sr.athlete,
        sr.leagueId
      );
      athletes.push(teamAthlete);
      if (position) {
        positions.push(position);
      }
    });

    return { athletes, positions };
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
          week: event.week?.number ?? null,
          leagueId: leagueId,
        },
      },
    },
    team: { connect: { id: teamId } },
    leagueId: leagueId,
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
  const isInjured = athlete.injuries.length > 0; //TBD
  const positions: Prisma.PositionCreateInput[] = [];
  const parent = athlete.position.parent;
  const dob = new Date(athlete.dateOfBirth);
  const validDate = isValidDate(dob);
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
    dateOfBirth: validDate ? dob : null,
    birthday: validDate
      ? `${dob.getMonth() + 1}/${dob.getDate()}/${dob.getFullYear()}`
      : null,
    espnUrl:
      athlete.links.find((l) => l.shortText === "Player Card")?.href ?? "",
    slug: athlete.slug,
    number: athlete.jersey,
    isInjured: isInjured,
    injuryStatus:
      athlete.injuries.length > 0 ? athlete.injuries[0].status : null,
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

const isValidDate = (date: Date) => {
  return (
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date.getTime())
  );
};

const createLeagueAthlete: (
  athlete: EspnApiV2.ResponseLeagueAthlete.Athlete,
  leagueId: string
) => {
  teamAthlete: Prisma.AthleteCreateInput;
  position: Prisma.PositionCreateInput;
} = (athlete, leagueId) => {
  const dob = new Date(athlete.dateOfBirth);
  const teamId = athlete.team?.$ref?.split("/")?.pop()?.split("?")[0];
  const validDate = isValidDate(dob);

  const teamAthlete = {
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
    dateOfBirth: validDate ? dob : null,
    birthday: validDate
      ? `${dob.getMonth() + 1}/${dob.getDate()}/${dob.getFullYear()}`
      : null,
    espnUrl:
      athlete.links?.find((l) => l.shortText === "Player Card")?.href ?? "",
    slug: athlete.slug,
    number: athlete.jersey,
    isInjured: false,
    injuryStatus: "TBD", //TBD
    position: {
      connect: {
        espnId_leagueId: { espnId: athlete.position.id, leagueId: leagueId },
      },
    },
  };
  if (teamId) {
    teamAthlete["team"] = { connect: { id: teamId } };
  }

  const position = createPosition(athlete.position, leagueId);

  return { teamAthlete, position };
};

const createPosition: (
  espnPosition:
    | EspnApiV2.ResponseTeamRoster.Position
    | EspnApiV2.ResponseLeagueAthlete.Position,
  leagueId: string
) => Prisma.PositionCreateInput = (espnPosition, leagueId) => {
  return {
    espnId: espnPosition.id,
    name: espnPosition.name,
    displayName: espnPosition.displayName,
    abbreviation: espnPosition.abbreviation,
    parentPositionId: espnPosition["parent"]?.["id"],
    league: { connect: { id: leagueId } },
  };
};

const createDepth: (
  depthChart: EspnApiV2.ResponseTeamDepthChart.Item,
  leagueId: string
) => Prisma.DepthCreateInput[] = (depthChart, leagueId) => {
  const depths: Prisma.DepthCreateInput[] = [];
  Object.keys(depthChart.positions).forEach((key) => {
    const athletes = depthChart.positions[key].athletes;
    const position = depthChart.positions[key].position;
    athletes.forEach((a) => {
      const athleteEspnId = (() => {
        const splitRef = a.athlete.$ref.split("/");
        return splitRef[splitRef.length - 1].split("?")[0];
      })();
      const depth: Prisma.DepthCreateInput = {
        espnId: depthChart.id,
        name: depthChart.name,
        league: { connect: { id: leagueId } },
        depth: a.rank,
        positions: {
          connectOrCreate: [
            {
              where: { id: position.id },
              create: {
                espnId: position.id,
                name: position.name,
                displayName: position.displayName,
                abbreviation: position.abbreviation,
                league: { connect: { id: leagueId } },
              },
            },
          ],
        },
        athletes: {
          connect: [
            {
              id: athleteEspnId,
            },
          ],
        },
      };
      depths.push(depth);
    });
  });
  return depths;
};
