import {
  Athlete,
  AthleteGameStatistic,
  DefensiveStatistics,
  FumbleStatistics,
  GameStatistic,
  InterceptionStatistics,
  KickingStatistics,
  KickReturnStatistics,
  NflAthleteStatistic,
  NflTeamStatistic,
  PassingStatistics,
  Prisma,
  PuntingStatistics,
  PuntReturnStatistics,
  ReceivingStatistics,
  RushingStatistics,
  TeamGameStatistic,
} from "@prisma/client";

import { upsertAthleteGameStatistics } from "../../models/athleteGameStatistics";
import {
  upsertAthleteDefensiveStatistics,
  upsertTeamDefensiveStatistics,
} from "../../models/defensiveStatistics";
import {
  upsertAthleteFumbleStatistics,
  upsertTeamFumbleStatistics,
} from "../../models/fumbleStatistics";
import { upsertGameStatistics } from "../../models/GameStatistics";
import {
  upsertAthleteInterceptionStatistics,
  upsertTeamInterceptionStatistics,
} from "../../models/interceptionStatistics";
import {
  upsertAthleteKickingStatistics,
  upsertTeamKickingStatistics,
} from "../../models/kickingStatistic";
import {
  upsertAthleteKickReturnStatistics,
  upsertTeamKickReturnStatistics,
} from "../../models/kickReturnStatistic";
import {
  upsertNflAthleteStatisticStatistics,
  upsertNflAthleteTotalStatisticStatistics,
} from "../../models/nflAthleteStatistics copy";
import { upsertNflTeamStatistics } from "../../models/nflTeamStatistics";
import {
  upsertAthletePassingStatistics,
  upsertTeamPassingStatistics,
} from "../../models/passingStatistics";
import {
  upsertAthletePuntingStatistics,
  upsertTeamPuntingStatistics,
} from "../../models/puntingStatistic";
import {
  upsertAthletePuntReturnStatistics,
  upsertTeamPuntReturnStatistics,
} from "../../models/puntReturnStatistic";
import {
  upsertAthleteReceivingStatistics,
  upsertTeamReceivingStatistics,
} from "../../models/receivingStatistics";
import {
  upsertAthleteRushingStatistics,
  upsertTeamRushingStatistics,
} from "../../models/rushingStatistics";
import { upsertTeamGameStatistics } from "../../models/teamGameStatistics";
import { EspnApiV2 } from "../../types/EspnApiV2/espnApiV2";
import { ListAllNflGamesResponse } from "../../types/games";

export const createTeam: (
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

export const createGame: (
  event: EspnApiV2.ResponseTeamSchedule.Event,
  homeTeamId: string,
  leagueId: string,
  awayTeamId: string
) => Prisma.GameCreateInput = (event, homeTeamId, leagueId, awayTeamId) => {
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
          yearNumber_type: {
            yearNumber: event.season.year,
            type: event.seasonType.type,
          },
        },
        create: {
          type: event.seasonType.type,
          name: event.seasonType.name,
          Year: {
            connectOrCreate: {
              where: { year: event.season.year },
              create: { year: event.season.year },
            },
          },
        },
      },
    },
  };
};

export const createTeamAthlete: (
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

const isValidDate = (date: Date) => {
  return (
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date.getTime())
  );
};

export const createLeagueAthlete: (
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

export const createDepth: (
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

export const mapIdenticalGames: (
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

export const createGameStatistic: (gameSummaryResponse: {
  gameSummary: EspnApiV2.GameSummaryResponse;
  game: ListAllNflGamesResponse;
}) => Promise<GameStatistic> = async (gameSummaryResponse) => {
  const game = gameSummaryResponse.game;
  const gameStatistics: Prisma.GameStatisticCreateInput = {
    Game: { connect: { id: game.id } },
  };

  const savedGameStatistic = await upsertGameStatistics(
    game.id,
    gameStatistics
  );
  return savedGameStatistic;
};

export const createTeamGameStatistics: (
  boxscore: EspnApiV2.ResponseGameSummary.Boxscore,
  game: ListAllNflGamesResponse,
  savedGameStatisticId: string
) => Promise<TeamGameStatistic[]> = async (
  boxscore,
  game,
  savedGameStatisticId
) => {
  const savedTeamGameStatistics = Promise.all(
    boxscore.teams.map(async (t) => {
      const team = game.Teams.find((gt) => gt.espnId === t.team.id);
      const playerStatistics = boxscore.players?.find((p) => {
        return game.Teams.map((t) => t.espnId).includes(p.team.id);
      })?.statistics;

      const teamGameStatistics: Prisma.TeamGameStatisticCreateInput = {
        Team: { connect: { id: team.id } },
        gameId: game.id,
        GameStatistic: { connect: { id: savedGameStatisticId } },
      };

      const savedTeamGameStatistic = await upsertTeamGameStatistics(
        team.id,
        game.id,
        teamGameStatistics
      );

      await createNflTeamStatistics(
        t.statistics,
        playerStatistics,
        team.id,
        game.id,
        savedTeamGameStatistic.id
      );
      return savedTeamGameStatistic;
    })
  );
  return savedTeamGameStatistics;
};

export const createAthleteGameStatistics: (
  boxscore: EspnApiV2.ResponseGameSummary.Boxscore,
  game: ListAllNflGamesResponse,
  savedGameStatisticId: string,
  athletes: Athlete[]
) => Promise<AthleteGameStatistic[]> = async (
  boxscore,
  game,
  savedGameStatisticId,
  athletes
) => {
  const athleteHash = boxscore.players?.reduce((acc, p) => {
    const team = game.Teams.find((gt) => gt.espnId === p.team.id);
    p.statistics.forEach((s) => {
      return s.athletes.forEach((a) => {
        const athlete = athletes.find((at) => at.guid === a.athlete.guid);
        if (athlete) {
          if (acc[a.athlete.guid]) {
            acc[a.athlete.guid].statistics.push({
              name: s.name,
              stats: a.stats,
            });
          } else {
            acc[a.athlete.guid] = {
              athleteId: athlete.id,
              gameId: game.id,
              teamId: team.id,
              statistics: [{ name: s.name, stats: a.stats }],
            };
          }
        }
      });
    });
    return acc;
  }, {} as Record<string, { athleteId: string; gameId: string; teamId: string; statistics: { name: string; stats: string[] }[] }>);
  const savedAthleteGameStatistics = Promise.all(
    Object.keys(athleteHash ?? {}).map(async (key) => {
      const athlete = athleteHash[key];

      const nflAthleteStatistics = await createNflAthleteStatistics(
        athlete.statistics,
        game.id,
        athlete.athleteId,
        null
      );
      const athleteGameStatistics: Prisma.AthleteGameStatisticCreateInput = {
        Athlete: { connect: { id: athlete.athleteId } },
        GameStatistic: { connect: { id: savedGameStatisticId } },
        NflStatistic: {
          connect: {
            id: nflAthleteStatistics?.id ?? "",
          },
        },
      };

      const savedAthleteGameStatistics = await upsertAthleteGameStatistics(
        athlete.athleteId,
        savedGameStatisticId,
        athleteGameStatistics
      );

      return savedAthleteGameStatistics;
    })
  );
  return savedAthleteGameStatistics;
};

const createNflTeamStatistics: (
  teamStatistics: EspnApiV2.ResponseGameSummary.TeamStatistic[],
  playerStatistics: EspnApiV2.ResponseGameSummary.PlayerStatistic[],
  teamId: string,
  gameId: string,
  savedTeamGameStatisticId: string
) => Promise<NflTeamStatistic> = async (
  teamStatistics,
  playerStatistics,
  teamId,
  gameId,
  savedTeamGameStatisticId
) => {
  const athleteTotalStatistics = await createNflAthleteStatistics(
    playerStatistics?.map((p) => {
      return { name: p.name, stats: p.totals };
    }),
    gameId,
    null,
    teamId
  );
  const nflTeamStatistic: Prisma.NflTeamStatisticCreateInput = {
    firstDowns: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "firstDowns")?.displayValue
    ),
    firstDownsPassing: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "firstDownsPassing")?.displayValue
    ),
    firstDownsRushing: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "firstDownsRushing")?.displayValue
    ),
    firstDownsPenalty: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "firstDownsPenalty")?.displayValue
    ),
    thirdDownEff:
      teamStatistics.find((s) => s.name === "thirdDownEff")?.displayValue ??
      "0-0",
    fourthDownEff:
      teamStatistics.find((s) => s.name === "fourthDownEff")?.displayValue ??
      "0-0",
    totalOffensivePlays: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "totalOffensivePlays")?.displayValue
    ),
    totalYards: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "totalYards")?.displayValue
    ),
    yardsPerPlay: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "yardsPerPlay")?.displayValue
    ),
    totalDrives: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "totalDrives")?.displayValue
    ),
    netPassingYards: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "netPassingYards")?.displayValue
    ),
    completionsAttempts:
      teamStatistics.find((s) => s.name === "completionAttempts")
        ?.displayValue ?? "0-0",
    yardsPerPass: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "yardsPerPass")?.displayValue
    ),
    interceptions: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "int")?.displayValue
    ),
    sacks: stringToNumberOrZero(
      teamStatistics
        .find((s) => s.name === "sacksYardsLost")
        ?.displayValue?.split("-")?.[0]
    ),
    sackYards: stringToNumberOrZero(
      teamStatistics
        .find((s) => s.name === "sacksYardsLost")
        ?.displayValue?.split("-")?.[1]
    ),
    rushingYards: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "rushingYards")?.displayValue
    ),
    rushingAttempts: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "rushingAttempts")?.displayValue
    ),
    yardsPerRushAttempt: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "yardsPerRushAttempt")?.displayValue
    ),
    redZoneAttempts: stringToNumberOrZero(
      teamStatistics
        .find((s) => s.name === "redZoneAttempts")
        ?.displayValue?.split("-")?.[0]
    ),
    redZoneConversions: stringToNumberOrZero(
      teamStatistics
        .find((s) => s.name === "redZoneAttempts")
        ?.displayValue?.split("-")?.[1]
    ),
    totalPenalties: stringToNumberOrZero(
      teamStatistics
        .find((s) => s.name === "totalPenaltiesYards")
        ?.displayValue?.split("-")?.[0]
    ),
    totalPenaltyYards: stringToNumberOrZero(
      teamStatistics
        .find((s) => s.name === "totalPenaltiesYards")
        ?.displayValue?.split("-")?.[1]
    ),
    turnovers: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "turnovers")?.displayValue
    ),
    fumblesLost: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "fumblesLost")?.displayValue
    ),
    interceptionsThrown: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "interceptions")?.displayValue
    ),
    defensiveTds: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "defensiveTouchdowns")?.displayValue
    ),
    possessionTime:
      teamStatistics.find((s) => s.name === "possessionTime")?.displayValue ??
      "0-0",
    AthleteTotalStatistics: { connect: { id: athleteTotalStatistics.id } },
    TeamGameStatistic: { connect: { id: savedTeamGameStatisticId } },
    teamId: teamId,
    gameId: gameId,
  };

  return await upsertNflTeamStatistics(teamId, gameId, nflTeamStatistic);
};

const createNflAthleteStatistics: (
  athleteStats: { name: string; stats: string[] }[],
  gameId: string,
  athleteId?: string,
  teamId?: string
) => Promise<NflAthleteStatistic> = async (
  athleteStats,
  gameId,
  athleteId,
  teamId
) => {
  const passingStatistics = await createPassingStatistics(
    athleteStats?.find((s) => s.name === "passing")?.stats,
    gameId,
    teamId,
    athleteId
  );
  const rushingStatistics = await createRushingStatistics(
    athleteStats?.find((s) => s.name === "rushing")?.stats,
    gameId,
    teamId,
    athleteId
  );
  const receivingStatistics = await createReceivingStatistics(
    athleteStats?.find((s) => s.name === "receiving")?.stats,
    gameId,
    teamId,
    athleteId
  );
  const fumbleStatistics = await createFumbleStatistics(
    athleteStats?.find((s) => s.name === "fumbles")?.stats,
    gameId,
    teamId,
    athleteId
  );
  const kickingStatistics = await createKickingStatistics(
    athleteStats?.find((s) => s.name === "kicking")?.stats,
    gameId,
    teamId,
    athleteId
  );
  const puntingStatistics = await createPuntingStatistics(
    athleteStats?.find((s) => s.name === "punting")?.stats,
    gameId,
    teamId,
    athleteId
  );
  const kickReturnStatistics = await createKickReturnStatistics(
    athleteStats?.find((s) => s.name === "kickReturns")?.stats,
    gameId,
    teamId,
    athleteId
  );
  const puntReturnStatistics = await createPuntReturnStatistics(
    athleteStats?.find((s) => s.name === "puntReturns")?.stats,
    gameId,
    teamId,
    athleteId
  );
  const defensiveStatistics = await createDefensiveStatistics(
    athleteStats?.find((s) => s.name === "defensive")?.stats,
    gameId,
    teamId,
    athleteId
  );
  const interceptionStatistics = await createInterceptionStatistics(
    athleteStats?.find((s) => s.name === "interceptions")?.stats,
    gameId,
    teamId,
    athleteId
  );

  const athleteStatistics: Prisma.NflAthleteStatisticCreateInput = {
    PassingStatistics: { connect: { id: passingStatistics?.id ?? "" } },
    RushingStatistics: { connect: { id: rushingStatistics?.id ?? "" } },
    ReceivingStatistics: { connect: { id: receivingStatistics?.id ?? "" } },
    FumbleStatistics: { connect: { id: fumbleStatistics?.id ?? "" } },
    KickingStatistics: { connect: { id: kickingStatistics?.id ?? "" } },
    PuntingStatistics: { connect: { id: puntingStatistics?.id ?? "" } },
    KickReturnStatistics: { connect: { id: kickReturnStatistics?.id ?? "" } },
    PuntReturnStatistics: { connect: { id: puntReturnStatistics?.id ?? "" } },
    DefensiveStatistics: { connect: { id: defensiveStatistics?.id ?? "" } },
    InterceptionStatistics: {
      connect: { id: interceptionStatistics?.id ?? "" },
    },
    gameId: gameId,
  };

  if (teamId) {
    athleteStatistics["teamId"] = teamId;
    const savedAthleteStatistics =
      await upsertNflAthleteTotalStatisticStatistics(
        teamId,
        gameId,
        athleteStatistics
      );
    return savedAthleteStatistics;
  }
  if (athleteId) {
    athleteStatistics["athleteId"] = athleteId;
    const savedAthleteStatistics = await upsertNflAthleteStatisticStatistics(
      athleteId,
      gameId,
      athleteStatistics
    );

    return savedAthleteStatistics;
  }
};

const createPassingStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<PassingStatistics> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  const statistic: Prisma.PassingStatisticsCreateInput = {
    completions: stringToNumberOrZero(playerStatistic?.[0]?.split("/")?.[0]),
    attempts: stringToNumberOrZero(playerStatistic?.[0]?.split("/")?.[1]),
    yards: stringToNumberOrZero(playerStatistic?.[1]),
    yardsPerAttempt: stringToNumberOrZero(playerStatistic?.[2]),
    touchdowns: stringToNumberOrZero(playerStatistic?.[3]),
    interceptions: stringToNumberOrZero(playerStatistic?.[4]),
    sacks: stringToNumberOrZero(playerStatistic?.[5]?.split("-")?.[0]),
    sackYardsLost: stringToNumberOrZero(playerStatistic?.[5]?.split("-")?.[1]),
    adjustedRating: stringToNumberOrZero(playerStatistic?.[6]),
    rating: stringToNumberOrZero(playerStatistic?.[7]),
    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamPassingStatistics(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthletePassingStatistics(athleteId, gameId, statistic);
  }
};

const createRushingStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<RushingStatistics> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  const statistic: Prisma.RushingStatisticsCreateInput = {
    attempts: stringToNumberOrZero(playerStatistic?.[0]),
    yards: stringToNumberOrZero(playerStatistic?.[1]),
    yardsPerAttempt: stringToNumberOrZero(playerStatistic?.[2]),
    touchdowns: stringToNumberOrZero(playerStatistic?.[3]),
    longest: stringToNumberOrZero(playerStatistic?.[4]),
    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamRushingStatistics(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthleteRushingStatistics(athleteId, gameId, statistic);
  }
};

const createReceivingStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<ReceivingStatistics> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  const statistic: Prisma.ReceivingStatisticsCreateInput = {
    receptions: stringToNumberOrZero(playerStatistic?.[0]),
    yards: stringToNumberOrZero(playerStatistic?.[1]),
    yardsPerReception: stringToNumberOrZero(playerStatistic?.[2]),
    touchdowns: stringToNumberOrZero(playerStatistic?.[3]),
    longest: stringToNumberOrZero(playerStatistic?.[4]),
    targets: stringToNumberOrZero(playerStatistic?.[5]),
    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamReceivingStatistics(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthleteReceivingStatistics(athleteId, gameId, statistic);
  }
};

const createFumbleStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<FumbleStatistics> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  const statistic: Prisma.FumbleStatisticsCreateInput = {
    fumbles: stringToNumberOrZero(playerStatistic?.[0]),
    lost: stringToNumberOrZero(playerStatistic?.[1]),
    recovered: stringToNumberOrZero(playerStatistic?.[2]),
    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamFumbleStatistics(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthleteFumbleStatistics(athleteId, gameId, statistic);
  }
};

const createDefensiveStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<DefensiveStatistics> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  const statistic: Prisma.DefensiveStatisticsCreateInput = {
    totalTackles: stringToNumberOrZero(playerStatistic?.[0]),
    soloTackles: stringToNumberOrZero(playerStatistic?.[1]),
    sacks: stringToNumberOrZero(playerStatistic?.[2]),
    tacklesForLoss: stringToNumberOrZero(playerStatistic?.[3]),
    passesDefended: stringToNumberOrZero(playerStatistic?.[4]),
    qbHits: stringToNumberOrZero(playerStatistic?.[5]),
    touchdowns: stringToNumberOrZero(playerStatistic?.[6]),
    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamDefensiveStatistics(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthleteDefensiveStatistics(athleteId, gameId, statistic);
  }
};

const createInterceptionStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<InterceptionStatistics> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  const statistic: Prisma.InterceptionStatisticsCreateInput = {
    interceptions: stringToNumberOrZero(playerStatistic?.[0]),
    yards: stringToNumberOrZero(playerStatistic?.[1]),
    touchdowns: stringToNumberOrZero(playerStatistic?.[2]),
    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamInterceptionStatistics(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthleteInterceptionStatistics(
      athleteId,
      gameId,
      statistic
    );
  }
};

const createKickReturnStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<KickReturnStatistics> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  const statistic: Prisma.KickReturnStatisticsCreateInput = {
    returns: stringToNumberOrZero(playerStatistic?.[0]),
    yards: stringToNumberOrZero(playerStatistic?.[1]),
    yardsPerReturn: stringToNumberOrZero(playerStatistic?.[2]),
    touchdowns: stringToNumberOrZero(playerStatistic?.[3]),
    longest: stringToNumberOrZero(playerStatistic?.[4]),
    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamKickReturnStatistics(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthleteKickReturnStatistics(
      athleteId,
      gameId,
      statistic
    );
  }
};

const createPuntReturnStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<PuntReturnStatistics> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  const statistic: Prisma.PuntReturnStatisticsCreateInput = {
    returns: stringToNumberOrZero(playerStatistic?.[0]),
    yards: stringToNumberOrZero(playerStatistic?.[1]),
    yardsPerReturn: stringToNumberOrZero(playerStatistic?.[2]),
    touchdowns: stringToNumberOrZero(playerStatistic?.[3]),
    longest: stringToNumberOrZero(playerStatistic?.[4]),
    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamPuntReturnStatistics(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthletePuntReturnStatistics(
      athleteId,
      gameId,
      statistic
    );
  }
};

const createKickingStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<KickingStatistics> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  const statistic: Prisma.KickingStatisticsCreateInput = {
    fieldGoalAttempts: stringToNumberOrZero(
      playerStatistic?.[0]?.split("/")?.[0]
    ),
    fieldGoalMade: stringToNumberOrZero(playerStatistic?.[1]?.split("/")?.[1]),
    fieldGoalPct: stringToNumberOrZero(playerStatistic?.[2]),
    longest: stringToNumberOrZero(playerStatistic?.[3]),
    extraPointAttempts: stringToNumberOrZero(
      playerStatistic?.[4]?.split("-")?.[0]
    ),
    extraPointMade: stringToNumberOrZero(playerStatistic?.[4]?.split("-")?.[1]),
    totalPoints: stringToNumberOrZero(playerStatistic?.[5]),
    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamKickingStatistics(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthleteKickingStatistics(athleteId, gameId, statistic);
  }
};

const createPuntingStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<PuntingStatistics> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  const statistic: Prisma.PuntingStatisticsCreateInput = {
    punts: stringToNumberOrZero(playerStatistic?.[0]),
    yards: stringToNumberOrZero(playerStatistic?.[1]),
    yardsPerPunt: stringToNumberOrZero(playerStatistic?.[2]),
    longest: stringToNumberOrZero(playerStatistic?.[3]),
    puntsInside20: stringToNumberOrZero(playerStatistic?.[4]),
    touchbacks: stringToNumberOrZero(playerStatistic?.[5]),
    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamPuntingStatistics(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthletePuntingStatistics(athleteId, gameId, statistic);
  }
};

const stringToNumberOrZero: (string: string) => number | null = (string) => {
  const value = parseFloat(string);
  if (!isNaN(value)) {
    return value;
  }
  return 0;
};
