import { Prisma } from "@prisma/client";

import { EspnApiV2 } from "../../types/EspnApiV2/espnApiV2";
import { create } from "domain";

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
    const games: Prisma.GameCreateInput[] = [];
    const uniqueGames = mapIdenticalGames(scheduleResponse);
    uniqueGames.forEach((g) => {
      const game = createGame(
        g.event,
        g.homeTeamId,
        g.leagueId,
        g.awayTeamId,
        g.season
      );
      games.push(game);
    });
    // Connect Identical Games

    return games;
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
      Athletes: {
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
          const isSaved = league?.Athletes.find((aEId) => {
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
      const { leagueAthlete, position } = createLeagueAthlete(
        sr.athlete,
        sr.leagueId
      );
      athletes.push(leagueAthlete);
      if (position) {
        positions.push(position);
      }
    });

    return { athletes, positions };
  },
  handleGameSummaryResponse: (
    gameSummaryResponse: {
      gameSummary: EspnApiV2.GameSummaryResponse;
      game: {
        id: string;
        espnId: string;
        Teams: {
          id: string;
          espnId: string;
        }[];
        League: {
          id: string;
          slug: string;
          sport: string;
        };
      };
    }[]
  ) => {
    const gameStatistics: Prisma.GameStatisticCreateInput[] = [];
    gameSummaryResponse.forEach((sr) => {
      const gameStatistic = createGameStatistic(sr);
    });
  },
};

const createTeam: (
  team: EspnApiV2.ResponseTeamList.TeamTeam,
  leagueId: string
) => Prisma.TeamCreateInput = (team, leagueId) => {
  return {
    League: { connect: { id: leagueId } },
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

const createGame: (
  event: EspnApiV2.ResponseTeamSchedule.Event,
  homeTeamId: string,
  leagueId: string,
  awayTeamId: string,
  season: EspnApiV2.ResponseTeamSchedule.RequestedSeasonClass
) => Prisma.GameCreateInput = (
  event,
  homeTeamId,
  leagueId,
  awayTeamId,
  season
) => {
  return {
    espnId: event.id,
    date: new Date(event.date),
    name: event.name,
    shortName: event.shortName,
    week: event.week?.number ?? null,
    isComplete: event.competitions?.[0]?.status?.type?.completed ?? false,
    awayTeamId,
    homeTeamId,
    League: { connect: { id: leagueId } },
    Teams: { connect: [{ id: homeTeamId }, { id: awayTeamId }] },
    Season: {
      connectOrCreate: {
        where: {
          yearNumber_type: { yearNumber: season.year, type: season.type },
        },
        create: {
          type: season.type,
          name: season.name,
          Year: {
            connectOrCreate: {
              where: { year: season.year },
              create: { year: season.year },
            },
          },
        },
      },
    },
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
  const positions: Prisma.PositionCreateInput[] = [];
  const parent = athlete.position.parent;
  const teamAthlete = createAthlete(athlete, teamId, leagueId);
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
  leagueAthlete: Prisma.AthleteCreateInput;
  position: Prisma.PositionCreateInput;
} = (athlete, leagueId) => {
  const teamId = athlete.team?.$ref?.split("/")?.pop()?.split("?")[0];
  const leagueAthlete = createAthlete(athlete, teamId, leagueId);
  const position = createPosition(athlete.position, leagueId);

  return { leagueAthlete, position };
};

const createAthlete: (
  athlete:
    | EspnApiV2.ResponseLeagueAthlete.Athlete
    | EspnApiV2.ResponseTeamRoster.Item,
  teamId: string,
  leagueId: string
) => Prisma.AthleteCreateInput = (athlete, teamId, leagueId) => {
  const isInjured = athlete["injuries"]?.length > 0;

  const dob = new Date(athlete.dateOfBirth);
  const validDate = isValidDate(dob);

  return {
    Team: { connect: { id: teamId } },
    League: { connect: { id: leagueId } },
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
    isInjured: isInjured,
    injuryStatus: isInjured ? athlete["injuries"][0].status : null,
    Position: {
      connect: {
        espnId_leagueId: { espnId: athlete.position.id, leagueId: leagueId },
      },
    },
  };
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
    League: { connect: { id: leagueId } },
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
        League: { connect: { id: leagueId } },
        depth: a.rank,
        Positions: {
          connectOrCreate: [
            {
              where: { id: position.id },
              create: {
                espnId: position.id,
                name: position.name,
                displayName: position.displayName,
                abbreviation: position.abbreviation,
                League: { connect: { id: leagueId } },
              },
            },
          ],
        },
        Athletes: {
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

const mapIdenticalGames: (
  scheduleResponses: {
    schedule: EspnApiV2.TeamScheduleResponse;
    teamId: string;
    leagueId: string;
  }[]
) => {
  awayTeamId?: string;
  homeTeamId?: string;
  event: EspnApiV2.ResponseTeamSchedule.Event;
  leagueId: string;
  season: EspnApiV2.ResponseTeamSchedule.RequestedSeasonClass;
}[] = (scheduleResponse) => {
  const gameHash: Record<
    string,
    {
      awayTeamId?: string;
      homeTeamId?: string;
      event: EspnApiV2.ResponseTeamSchedule.Event;
      leagueId: string;
      season: EspnApiV2.ResponseTeamSchedule.RequestedSeasonClass;
    }
  > = {};
  scheduleResponse.forEach((sr) => {
    return sr.schedule.events.forEach((e) => {
      if (gameHash[`${e.id}_${sr.leagueId}`]) {
        const value = gameHash[`${e.id}_${sr.leagueId}`];
        if (value.awayTeamId) {
          gameHash[`${e.id}_${sr.leagueId}`] = {
            ...gameHash[`${e.id}_${sr.leagueId}`],
            homeTeamId: sr.teamId,
          };
        } else if (value.homeTeamId) {
          gameHash[`${e.id}_${sr.leagueId}`] = {
            ...gameHash[`${e.id}_${sr.leagueId}`],
            awayTeamId: sr.teamId,
          };
        }
      } else {
        const isHome =
          e.competitions[0].competitors.find((c) => c.id === sr.teamId)
            ?.homeAway === "home";
        if (isHome) {
          gameHash[`${e.id}_${sr.leagueId}`] = {
            homeTeamId: sr.teamId,
            awayTeamId: undefined,
            leagueId: sr.leagueId,
            event: e,
            season: sr.schedule.season,
          };
        } else {
          gameHash[`${e.id}_${sr.leagueId}`] = {
            awayTeamId: sr.teamId,
            homeTeamId: undefined,
            leagueId: sr.leagueId,
            event: e,
            season: sr.schedule.season,
          };
        }
      }
    });
  });
  return Object.values(gameHash).map((g) => g);
};

const createGameStatistic: (gameSummaryResponse: {
  gameSummary: EspnApiV2.GameSummaryResponse;
  game: {
    id: string;
    espnId: string;
    Teams: {
      id: string;
      espnId: string;
    }[];
    League: {
      id: string;
      slug: string;
      sport: string;
    };
  };
}) => Prisma.GameStatisticCreateInput = (gameSummaryResponse) => {
  const game = gameSummaryResponse.game;
  return {
    Game: { connect: { id: game.id } },
    League: { connect: { id: game.League.id } },
    TeamGameStatistics: {
      // create: createTeamGameStatistics(gameSummaryResponse),
    },
  };
};

// const createTeamGameStatistics: (gameSummaryResponse: {
//   gameSummary: EspnApiV2.GameSummaryResponse;
//   game: {
//     id: string;
//     espnId: string;
//     Teams: {
//       id: string;
//       espnId: string;
//     }[];
//     League: {
//       id: string;
//       slug: string;
//       sport: string;
//     };
//   };
// }) => Prisma.TeamGameStatisticCreateWithoutGameStatisticInput[] = (
//   gameSummaryResponse
// ) => {
//   const teamGameStatistics: Prisma.TeamGameStatisticCreateWithoutGameStatisticInput[] =
//     [];
//   gameSummaryResponse.gameSummary.boxscore.teams.forEach((t) => {
//     const teamId = gameSummaryResponse.game.Teams.find(
//       (gt) => gt.espnId === t.team.id
//     )?.id;
//     const teamGameStatistic: Prisma.TeamGameStatisticCreateWithoutGameStatisticInput =
//       {
//         Team: { connect: { id: teamId } },
//         NflStatistic: { create: createNflStatistics(t.statistics) },
//       };
//   });
// };

const createNflStatistics: (
  statistics: EspnApiV2.ResponseGameSummary.TeamStatistic[]
) => Prisma.NflTeamStatisticCreateWithoutTeamGameStatisticInput = (
  statistics
) => {
  return {
    firstDowns: stringToNumberOrNull(
      statistics.find((s) => s.name === "firstDowns")?.displayValue
    ),
    firstDownsPassing: stringToNumberOrNull(
      statistics.find((s) => s.name === "firstDownsPassing")?.displayValue
    ),
    firstDownsRushing: stringToNumberOrNull(
      statistics.find((s) => s.name === "firstDownsRushing")?.displayValue
    ),
    firstDownsPenalty: stringToNumberOrNull(
      statistics.find((s) => s.name === "firstDownsPenalty")?.displayValue
    ),
    thirdDownEff: statistics.find((s) => s.name === "thirdDownEff")
      ?.displayValue,
    fourthDownEff: statistics.find((s) => s.name === "fourthDownEff")
      ?.displayValue,
    totalOffensivePlays: stringToNumberOrNull(
      statistics.find((s) => s.name === "totalOffensivePlays")?.displayValue
    ),
    totalYards: stringToNumberOrNull(
      statistics.find((s) => s.name === "totalYards")?.displayValue
    ),
    yardsPerPlay: stringToNumberOrNull(
      statistics.find((s) => s.name === "yardsPerPlay")?.displayValue
    ),
    totalDrives: stringToNumberOrNull(
      statistics.find((s) => s.name === "totalDrives")?.displayValue
    ),
    netPassingYards: stringToNumberOrNull(
      statistics.find((s) => s.name === "netPassingYards")?.displayValue
    ),
    completionsAttempts: statistics.find(
      (s) => s.name === "completionsAttempts"
    )?.displayValue,
    yardsPerPass: stringToNumberOrNull(
      statistics.find((s) => s.name === "yardsPerPass")?.displayValue
    ),
    interceptions: stringToNumberOrNull(
      statistics.find((s) => s.name === "int")?.displayValue
    ),
    sacks: stringToNumberOrNull(
      statistics
        .find((s) => s.name === "sacksYardsLost")
        ?.displayValue?.split("-")?.[0]
    ),
    sackYards: stringToNumberOrNull(
      statistics
        .find((s) => s.name === "sacksYardsLost")
        ?.displayValue?.split("-")?.[1]
    ),
    rushingYards: stringToNumberOrNull(
      statistics.find((s) => s.name === "rushingYards")?.displayValue
    ),
    passingYards: stringToNumberOrNull(
      statistics.find((s) => s.name === "passingYards")?.displayValue
    ),
    rushingAttempts: stringToNumberOrNull(
      statistics.find((s) => s.name === "rushingAttempts")?.displayValue
    ),
    yardsPerRushAttempt: stringToNumberOrNull(
      statistics.find((s) => s.name === "yardsPerRushAttempt")?.displayValue
    ),
    redZoneAttempts: stringToNumberOrNull(
      statistics
        .find((s) => s.name === "redZoneAttempts")
        ?.displayValue?.split("-")?.[0]
    ),
    redZoneConversions: stringToNumberOrNull(
      statistics
        .find((s) => s.name === "redZoneAttempts")
        ?.displayValue?.split("-")?.[1]
    ),
    totalPenalties: stringToNumberOrNull(
      statistics
        .find((s) => s.name === "totalPenaltiesYards")
        ?.displayValue?.split("-")?.[0]
    ),
    totalPenaltyYards: stringToNumberOrNull(
      statistics
        .find((s) => s.name === "totalPenaltiesYards")
        ?.displayValue?.split("-")?.[1]
    ),
    turnovers: stringToNumberOrNull(
      statistics.find((s) => s.name === "turnovers")?.displayValue
    ),
    fumblesLost: stringToNumberOrNull(
      statistics.find((s) => s.name === "fumblesLost")?.displayValue
    ),
    interceptionsThrown: stringToNumberOrNull(
      statistics.find((s) => s.name === "interceptions")?.displayValue
    ),
    defensiveTds: stringToNumberOrNull(
      statistics.find((s) => s.name === "defensiveTouchdowns")?.displayValue
    ),
    possessionTime: statistics.find((s) => s.name === "possessionTime")
      ?.displayValue,
    AthleteTotalStatistics: {
      // create: createAthleteTotalStatistics(statistics),
    },
  };
};

// const createAthleteTotalStatistics: (
//   athleteStats: any
// ) => Prisma.NflAthleteStatisticCreateWithoutNflTeamStatisticInput = (
//   athleteStats
// ) => {
//   return {
//     PassingStatistics: { create: createPassingStatistics(athleteStats) },
//     RushingStatistics: { create: createRushingStatistics(athleteStats) },
//     ReceivingStatistics: { create: createReceivingStatistics(athleteStats) },
//     FumblesStatistics: { create: createFumblesStatistics(athleteStats) },
//     KickingStatistics: { create: createKickingStatistics(athleteStats) },
//     PuntingStatistics: { create: createPuntingStatistics(athleteStats) },
//     KickReturnStatistics: { create: createKickReturnStatistics(athleteStats) },
//     PuntReturnStatistics: { create: createPuntReturnStatistics(athleteStats) },
//     DefensiveStatistics: { create: createDefenseStatistics(athleteStats) },
//     InterceptionStatistics: {
//       create: createInterceptionStatistics(athleteStats),
//     },
//     FumbleStatistics: { create: createFumbleStatistics(athleteStats) },
//   };
// };

const stringToNumberOrNull: (string: string) => number | null = (string) => {
  const value = parseFloat(string);
  if (!isNaN(value)) {
    return value;
  }
  return null;
};
