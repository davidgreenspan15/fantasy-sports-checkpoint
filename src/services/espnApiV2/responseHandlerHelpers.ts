import {
  Athlete,
  AthleteGameStatistic,
  BasketballStatistic,
  DefensiveStatistic,
  FumbleStatistic,
  GameStatistic,
  InterceptionStatistic,
  KickingStatistic,
  KickReturnStatistic,
  NbaAthleteStatistic,
  NbaTeamStatistic,
  NflAthleteStatistic,
  NflTeamStatistic,
  PassingStatistic,
  Prisma,
  PuntingStatistic,
  PuntReturnStatistic,
  ReceivingStatistic,
  RushingStatistic,
  TeamGameStatistic,
  NhlTeamStatistic,
  NhlAthleteStatistic,
  SkaterStatistic,
  GoalieStatistic,
  Team,
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
} from "../../models/nflAthleteStatistics";
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
import { upsertNbaTeamStatistics } from "../../models/nbaTeamStatistics";
import {
  upsertNbaAthleteStatisticStatistics,
  upsertNbaAthleteTotalStatisticStatistics,
} from "../../models/nbaAthleteStatistics";
import {
  upsertAthleteBasketballStatistic,
  upsertTeamBasketballStatistic,
} from "../../models/basketballStatistics";
import { upsertNhlTeamStatistics } from "../../models/nhlTeamStatistics";
import {
  upsertNhlAthleteStatisticStatistics,
  upsertNhlAthleteTotalStatisticStatistics,
} from "../../models/nhlAthleteStatistics";
import {
  upsertAthleteSkaterStatistic,
  upsertTeamSkaterStatistic,
} from "../../models/skaterStatistics";
import {
  upsertAthleteGoalieStatistic,
  upsertTeamGoalieStatistic,
} from "../../models/goalieStatistics copy";

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
    color: team.color,
    alternateColor: team.alternateColor,
    uid: team.uid,
    imageUrl: team.logos?.[0]?.href ?? "",
  };
};

//TBD
// const createConferenceAndDivision: (
//   team: EspnApiV2.ResponseTeamList.TeamTeam
// ) => {} = async (team) => {

// };

export const createGame: (
  event: EspnApiV2.ResponseTeamSchedule.Event,
  leagueId: string,
  homeTeamId?: string,
  awayTeamId?: string
) => Prisma.GameCreateInput = (event, leagueId, homeTeamId, awayTeamId) => {
  const game: Prisma.GameCreateInput = {
    espnId: event.id,
    date: new Date(event.date),
    name: event.name,
    shortName: event.shortName,
    week: event.week?.number ?? null,
    isComplete: event.competitions?.[0]?.status?.type?.completed ?? false,
    League: { connect: { id: leagueId } },
    Teams: { connect: [] },
    Season: {
      connectOrCreate: {
        where: {
          displayYear_type: {
            displayYear: event.season.displayName,
            type: event.seasonType.type,
          },
        },
        create: {
          type: event.seasonType.type,
          name: event.seasonType.name,
          displayYear: event.season.displayName,
        },
      },
    },
  };
  if (homeTeamId) {
    game["homeTeamId"] = homeTeamId;
    (game.Teams.connect as Prisma.TeamWhereUniqueInput[]).push({
      id: homeTeamId,
    });
  } else if (awayTeamId) {
    game["awayTeamId"] = awayTeamId;
    (game.Teams.connect as Prisma.TeamWhereUniqueInput[]).push({
      id: awayTeamId,
    });
  }
  return game;
};

export const createTeamAthlete: (
  athlete: EspnApiV2.ResponseTeamRoster.Item,
  teamId: string,
  leagueId: string,
  teamRosterId: string
) => {
  teamAthlete: Prisma.AthleteCreateInput;
  positions: Prisma.PositionCreateInput[];
} = (athlete, teamId, leagueId, teamRosterId) => {
  const positions: Prisma.PositionCreateInput[] = [];
  const parent = athlete.position.parent;
  const teamAthlete = createAthlete(athlete, teamId, leagueId, teamRosterId);
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
  leagueId: string,
  teamRosterId?: string
) => Prisma.AthleteCreateInput = (athlete, teamId, leagueId, teamRosterId) => {
  const isInjured = athlete["injuries"]?.length > 0;

  const dob = new Date(athlete.dateOfBirth);
  const validDate = isValidDate(dob);
  const newAthlete = {
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
    imageUrl: athlete.headshot?.href ?? "",
    Position: {
      connect: {
        espnId_leagueId: { espnId: athlete.position.id, leagueId: leagueId },
      },
    },
  };
  if (teamRosterId) {
    newAthlete["Roster"] = { connect: { id: teamRosterId } };
  }
  return newAthlete;
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
        const isAway =
          e.competitions[0].competitors.find((c) => c.id === sr.teamId)
            ?.homeAway === "away";
        if (isHome) {
          gameHash[`${e.id}_${sr.leagueId}`] = {
            homeTeamId: sr.teamId,
            awayTeamId: undefined,
            leagueId: sr.leagueId,
            event: e,
            season: sr.schedule.season,
          };
        } else if (isAway) {
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

interface GameMap {
  awayTeamId?: string;
  homeTeamId?: string;
  event: EspnApiV2.ResponseTeamSchedule.Event;
  leagueId: string;
  season: EspnApiV2.ResponseTeamSchedule.RequestedSeasonClass;
}
export const mapIdenticalYearlyGames: (
  weeklyScheduleResponse: EspnApiV2.LeagueYearlyScheduleResponse,
  teams: Team[]
) => GameMap[] = (weeklyScheduleResponse, teams) => {
  return weeklyScheduleResponse.events
    .filter((t) => t.season.year === 2023 && t.season.type === 2)
    .map((e) => {
      const homeTeamId = teams.find(
        (t) =>
          t.espnId ===
          e.competitions[0].competitors.find((c) => c.homeAway === "home")?.id
      )?.id;
      const awayTeamId = teams.find(
        (t) =>
          t.espnId ===
          e.competitions[0].competitors.find((c) => c.homeAway === "away")?.id
      )?.id;
      e["seasonType"] = {
        id: "2",
        type: 2,
        name: "Regular Season",
        abbreviation: "reg",
      };
      e["timeValid"] = true;
      //@ts-ignore
      const event: EspnApiV2.ResponseTeamSchedule.Event = {
        ...e,
        seasonType: {
          id: "2",
          type: 2,
          name: EspnApiV2.ResponseTeamSchedule.SeasonTypeName.RegularSeason,
          abbreviation:
            EspnApiV2.ResponseTeamSchedule.SeasonTypeAbbreviation.Reg,
        },
        timeValid: true,
        season: {
          ...e.season,
          displayName: "2023",
        },
      };
      const gameMap: GameMap = {
        homeTeamId,
        awayTeamId,
        leagueId: "848ea1b8-47bf-4c8b-9936-674cbc2ec264",
        event,
        //@ts-ignore
        season: event.season,
      };
      return gameMap;
    });
};

export const createGameStatistic: (gameSummaryResponse: {
  gameSummary: EspnApiV2.GameSummaryResponse;
  game: ListAllNflGamesResponse;
}) => Promise<GameStatistic> = async (gameSummaryResponse) => {
  const game = gameSummaryResponse.game;
  const gameStatistics: Prisma.GameStatisticCreateInput = {
    Game: { connect: { id: game.id } },
    //@ts-ignore
    jsonPayload: gameSummaryResponse.gameSummary as Prisma.InputJsonObject,
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
  savedGameStatisticId: string,
  scoringPlay:
    | EspnApiV2.ResponseGameSummary.ScoringPlay
    | EspnApiV2.ResponseGameSummary.Play
) => Promise<TeamGameStatistic[]> = async (
  boxscore,
  game,
  savedGameStatisticId,
  scoringPlay
) => {
  const savedTeamGameStatistics = Promise.all(
    boxscore.teams.map(async (t) => {
      const team = game.Teams.find((gt) => gt.espnId === t.team.id);
      const isHomeTeam = game.homeTeamId === team.id;
      const playerStatistics = boxscore.players?.find((p) => {
        return game.Teams.map((t) => t.espnId).includes(p.team.id);
      })?.statistics;

      const teamGameStatistics: Prisma.TeamGameStatisticCreateInput = {
        Team: { connect: { id: team.id } },
        teamScore:
          (isHomeTeam ? scoringPlay.homeScore : scoringPlay.awayScore) ?? 0,
        gameId: game.id,
        GameStatistic: { connect: { id: savedGameStatisticId } },
      };

      const savedTeamGameStatistic = await upsertTeamGameStatistics(
        team.id,
        game.id,
        teamGameStatistics
      );
      switch (game.League.slug) {
        case "nfl":
          await createNflTeamStatistics(
            t.statistics,
            playerStatistics,
            team.id,
            game.id,
            savedTeamGameStatistic.id
          );
          break;

        case "nba":
          await createNbaTeamStatistics(
            t.statistics,
            playerStatistics,
            team.id,
            game.id,
            savedTeamGameStatistic.id
          );
          break;
        case "nhl":
          await createNhlTeamStatistics(
            t.statistics,
            playerStatistics,
            team.id,
            game.id,
            savedTeamGameStatistic.id
          );

        default:
          break;
      }

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

      const athleteGameStatistics: Prisma.AthleteGameStatisticCreateInput = {
        Athlete: { connect: { id: athlete.athleteId } },
        GameStatistic: { connect: { id: savedGameStatisticId } },
      };
      switch (game.League.slug) {
        case "nfl":
          const nflAthleteStatistics = await createNflAthleteStatistics(
            athlete.statistics,
            game.id,
            athlete.athleteId,
            null
          );
          athleteGameStatistics["NflStatistic"] = {
            connect: {
              id: nflAthleteStatistics?.id ?? "",
            },
          };
          break;
        case "nba":
          const nbaAthleteStatistics = await createNbaAthleteStatistics(
            athlete.statistics,
            game.id,
            athlete.athleteId,
            null
          );
          athleteGameStatistics["NbaStatistic"] = {
            connect: {
              id: nbaAthleteStatistics?.id ?? "",
            },
          };
          break;
        case "nhl":
          const nhlAthleteStatistics = await createNhlAthleteStatistics(
            athlete.statistics,
            game.id,
            athlete.athleteId,
            null
          );
          athleteGameStatistics["NhlStatistic"] = {
            connect: {
              id: nhlAthleteStatistics?.id ?? "",
            },
          };
          break;

        default:
          break;
      }

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
    gameId: gameId,
  };
  if (passingStatistics) {
    athleteStatistics["PassingStatistic"] = {
      connect: { id: passingStatistics.id },
    };
  }
  if (rushingStatistics) {
    athleteStatistics["RushingStatistic"] = {
      connect: { id: rushingStatistics.id },
    };
  }
  if (receivingStatistics) {
    athleteStatistics["ReceivingStatistic"] = {
      connect: { id: receivingStatistics.id },
    };
  }
  if (fumbleStatistics) {
    athleteStatistics["FumbleStatistic"] = {
      connect: { id: fumbleStatistics.id },
    };
  }
  if (kickingStatistics) {
    athleteStatistics["KickingStatistic"] = {
      connect: { id: kickingStatistics.id },
    };
  }
  if (puntingStatistics) {
    athleteStatistics["PuntingStatistic"] = {
      connect: { id: puntingStatistics.id },
    };
  }
  if (kickReturnStatistics) {
    athleteStatistics["KickReturnStatistic"] = {
      connect: { id: kickReturnStatistics.id },
    };
  }
  if (puntReturnStatistics) {
    athleteStatistics["PuntReturnStatistic"] = {
      connect: { id: puntReturnStatistics.id },
    };
  }
  if (defensiveStatistics) {
    athleteStatistics["DefensiveStatistic"] = {
      connect: { id: defensiveStatistics.id },
    };
  }
  if (interceptionStatistics) {
    athleteStatistics["InterceptionStatistic"] = {
      connect: { id: interceptionStatistics.id },
    };
  }

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

const createNbaTeamStatistics: (
  teamStatistics: EspnApiV2.ResponseGameSummary.TeamStatistic[],
  playerStatistics: EspnApiV2.ResponseGameSummary.PlayerStatistic[],
  teamId: string,
  gameId: string,
  savedTeamGameStatisticId: string
) => Promise<NbaTeamStatistic> = async (
  teamStatistics,
  playerStatistics,
  teamId,
  gameId,
  savedTeamGameStatisticId
) => {
  const athleteTotalStatistics = await createNbaAthleteStatistics(
    playerStatistics?.map((p) => {
      return { name: p.name, stats: p.totals };
    }),
    gameId,
    null,
    teamId
  );
  const nbaTeamStatistic: Prisma.NbaTeamStatisticCreateInput = {
    fieldGoalsMade: stringToNumberOrZero(
      teamStatistics
        .find((s) => s.name === "fieldGoalsMade-fieldGoalsAttempted")
        ?.displayValue?.split("-")?.[0]
    ),
    fieldGoalsAttempted: stringToNumberOrZero(
      teamStatistics
        .find((s) => s.name === "fieldGoalsMade-fieldGoalsAttempted")
        ?.displayValue?.split("-")?.[1]
    ),
    fieldGoalPercentage: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "fieldGoalPct")?.displayValue
    ),
    threePointersMade: stringToNumberOrZero(
      teamStatistics
        .find(
          (s) =>
            s.name === "threePointFieldGoalsMade-threePointFieldGoalsAttempted"
        )
        ?.displayValue?.split("-")?.[0]
    ),
    threePointersAttempted: stringToNumberOrZero(
      teamStatistics
        .find(
          (s) =>
            s.name === "threePointFieldGoalsMade-threePointFieldGoalsAttempted"
        )
        ?.displayValue?.split("-")?.[1]
    ),
    threePointPercentage: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "threePointFieldGoalPct")
        ?.displayValue
    ),
    freeThrowsMade: stringToNumberOrZero(
      teamStatistics
        .find((s) => s.name === "freeThrowsMade-freeThrowsAttempted")
        ?.displayValue?.split("-")?.[0]
    ),
    freeThrowsAttempted: stringToNumberOrZero(
      teamStatistics
        .find((s) => s.name === "freeThrowsMade-freeThrowsAttempted")
        ?.displayValue?.split("-")?.[1]
    ),
    freeThrowPercentage: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "freeThrowPct")?.displayValue
    ),
    totalRebounds: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "totalRebounds")?.displayValue
    ),
    offensiveRebounds: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "offensiveRebounds")?.displayValue
    ),
    defensiveRebounds: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "defensiveRebounds")?.displayValue
    ),
    assists: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "assists")?.displayValue
    ),
    steals: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "steals")?.displayValue
    ),
    blocks: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "blocks")?.displayValue
    ),
    turnovers: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "turnovers")?.displayValue
    ),
    teamTurnovers: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "teamTurnovers")?.displayValue
    ),
    totalTurnovers: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "totalTurnovers")?.displayValue
    ),
    technicalFouls: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "technicalFouls")?.displayValue
    ),
    flagrantFouls: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "flagrantFouls")?.displayValue
    ),
    turnoversPoints: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "turnoversPoints")?.displayValue
    ),
    fastBreakPoints: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "fastBreakPoints")?.displayValue
    ),
    pointsPaint: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "pointsInPaint")?.displayValue
    ),
    fouls: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "fouls")?.displayValue
    ),
    largestLead: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "largestLead")?.displayValue
    ),
    AthleteTotalStatistics: { connect: { id: athleteTotalStatistics.id } },
    TeamGameStatistic: { connect: { id: savedTeamGameStatisticId } },
    teamId: teamId,
    gameId: gameId,
  };

  return await upsertNbaTeamStatistics(teamId, gameId, nbaTeamStatistic);
};

const createNhlTeamStatistics: (
  teamStatistics: EspnApiV2.ResponseGameSummary.TeamStatistic[],
  playerStatistics: EspnApiV2.ResponseGameSummary.PlayerStatistic[],
  teamId: string,
  gameId: string,
  savedTeamGameStatisticId: string
) => Promise<NhlTeamStatistic> = async (
  teamStatistics,
  playerStatistics,
  teamId,
  gameId,
  savedTeamGameStatisticId
) => {
  const athleteTotalStatistics = await createNhlAthleteStatistics(
    playerStatistics?.map((p) => {
      return { name: p.name, stats: p.totals ?? [] };
    }),
    gameId,
    null,
    teamId
  );
  const nhlTeamStatistic: Prisma.NhlTeamStatisticCreateInput = {
    blockedShots: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "blockedShots")?.displayValue
    ),
    hits: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "hits")?.displayValue
    ),
    takeaways: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "takeaways")?.displayValue
    ),
    shots: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "shotsTotal")?.displayValue
    ),
    powerPlayGoals: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "powerPlayGoals")?.displayValue
    ),
    powerPlayOpportunities: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "powerPlayOpportunities")
        ?.displayValue
    ),
    powerPlayPct: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "powerPlayPct")?.displayValue
    ),
    shortHandedGoals: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "shortHandedGoals")?.displayValue
    ),
    shootoutGoals: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "shootoutGoals")?.displayValue
    ),
    faceOffsWon: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "faceoffsWon")?.displayValue
    ),
    faceOffPct: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "faceoffWinPercent")?.displayValue
    ),
    giveaways: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "giveaways")?.displayValue
    ),
    penalties: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "penalties")?.displayValue
    ),
    penaltyMinutes: stringToNumberOrZero(
      teamStatistics.find((s) => s.name === "penaltyMinutes")?.displayValue
    ),

    AthleteTotalStatistics: { connect: { id: athleteTotalStatistics.id } },
    TeamGameStatistic: { connect: { id: savedTeamGameStatisticId } },
    teamId: teamId,
    gameId: gameId,
  };

  return await upsertNhlTeamStatistics(teamId, gameId, nhlTeamStatistic);
};

const createNbaAthleteStatistics: (
  athleteStats: { name: string; stats: string[] }[],
  gameId: string,
  athleteId?: string,
  teamId?: string
) => Promise<NbaAthleteStatistic> = async (
  athleteStats,
  gameId,
  athleteId,
  teamId
) => {
  const basketballStatistic = await createBasketBallStatistics(
    athleteStats?.[0]?.stats,
    gameId,
    teamId,
    athleteId
  );

  const athleteStatistics: Prisma.NbaAthleteStatisticCreateInput = {
    gameId: gameId,
  };
  if (basketballStatistic) {
    athleteStatistics["BasketballStatistic"] = {
      connect: { id: basketballStatistic.id },
    };
  }

  if (teamId) {
    athleteStatistics["teamId"] = teamId;
    const savedAthleteStatistics =
      await upsertNbaAthleteTotalStatisticStatistics(
        teamId,
        gameId,
        athleteStatistics
      );
    return savedAthleteStatistics;
  }
  if (athleteId) {
    athleteStatistics["athleteId"] = athleteId;
    const savedAthleteStatistics = await upsertNbaAthleteStatisticStatistics(
      athleteId,
      gameId,
      athleteStatistics
    );

    return savedAthleteStatistics;
  }
};

const createNhlAthleteStatistics: (
  athleteStats: { name: string; stats: string[] }[],
  gameId: string,
  athleteId?: string,
  teamId?: string
) => Promise<NhlAthleteStatistic> = async (
  athleteStats,
  gameId,
  athleteId,
  teamId
) => {
  const skaterStatistic = await createSkaterStatistics(
    athleteStats?.find((s) => s.name === "forwards")?.stats ??
      athleteStats?.find((s) => s.name === "defenses")?.stats,
    gameId,
    teamId,
    athleteId
  );

  const goalieStatistic = await createGoalieStatistics(
    athleteStats?.find((s) => s.name === "goalies")?.stats,
    gameId,
    teamId,
    athleteId
  );
  const athleteStatistics: Prisma.NhlAthleteStatisticCreateInput = {
    gameId: gameId,
  };
  if (skaterStatistic) {
    athleteStatistics["SkaterStatistic"] = {
      connect: { id: skaterStatistic.id },
    };
  }
  if (goalieStatistic) {
    athleteStatistics["GoalieStatistic"] = {
      connect: { id: goalieStatistic.id },
    };
  }

  if (teamId) {
    athleteStatistics["teamId"] = teamId;
    const savedAthleteStatistics =
      await upsertNhlAthleteTotalStatisticStatistics(
        teamId,
        gameId,
        athleteStatistics
      );
    return savedAthleteStatistics;
  }
  if (athleteId) {
    athleteStatistics["athleteId"] = athleteId;
    const savedAthleteStatistics = await upsertNhlAthleteStatisticStatistics(
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
) => Promise<PassingStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.PassingStatisticCreateInput = {
    completions: stringToNumberOrZero(playerStatistic[0]?.split("/")?.[0]),
    attempts: stringToNumberOrZero(playerStatistic[0]?.split("/")?.[1]),
    yards: stringToNumberOrZero(playerStatistic[1]),
    yardsPerAttempt: stringToNumberOrZero(playerStatistic[2]),
    touchdowns: stringToNumberOrZero(playerStatistic[3]),
    interceptions: stringToNumberOrZero(playerStatistic[4]),
    sacks: stringToNumberOrZero(playerStatistic[5]?.split("-")?.[0]),
    sackYardsLost: stringToNumberOrZero(playerStatistic[5]?.split("-")?.[1]),
    adjustedRating: stringToNumberOrZero(playerStatistic[6]),
    rating: stringToNumberOrZero(playerStatistic[7]),
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
) => Promise<RushingStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.RushingStatisticCreateInput = {
    attempts: stringToNumberOrZero(playerStatistic[0]),
    yards: stringToNumberOrZero(playerStatistic[1]),
    yardsPerAttempt: stringToNumberOrZero(playerStatistic[2]),
    touchdowns: stringToNumberOrZero(playerStatistic[3]),
    longest: stringToNumberOrZero(playerStatistic[4]),
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
) => Promise<ReceivingStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.ReceivingStatisticCreateInput = {
    receptions: stringToNumberOrZero(playerStatistic[0]),
    yards: stringToNumberOrZero(playerStatistic[1]),
    yardsPerReception: stringToNumberOrZero(playerStatistic[2]),
    touchdowns: stringToNumberOrZero(playerStatistic[3]),
    longest: stringToNumberOrZero(playerStatistic[4]),
    targets: stringToNumberOrZero(playerStatistic[5]),
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
) => Promise<FumbleStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.FumbleStatisticCreateInput = {
    fumbles: stringToNumberOrZero(playerStatistic[0]),
    lost: stringToNumberOrZero(playerStatistic[1]),
    recovered: stringToNumberOrZero(playerStatistic[2]),
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
) => Promise<DefensiveStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.DefensiveStatisticCreateInput = {
    totalTackles: stringToNumberOrZero(playerStatistic[0]),
    soloTackles: stringToNumberOrZero(playerStatistic[1]),
    sacks: stringToNumberOrZero(playerStatistic[2]),
    tacklesForLoss: stringToNumberOrZero(playerStatistic[3]),
    passesDefended: stringToNumberOrZero(playerStatistic[4]),
    qbHits: stringToNumberOrZero(playerStatistic[5]),
    touchdowns: stringToNumberOrZero(playerStatistic[6]),
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
) => Promise<InterceptionStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.InterceptionStatisticCreateInput = {
    interceptions: stringToNumberOrZero(playerStatistic[0]),
    yards: stringToNumberOrZero(playerStatistic[1]),
    touchdowns: stringToNumberOrZero(playerStatistic[2]),
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
) => Promise<KickReturnStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.KickReturnStatisticCreateInput = {
    returns: stringToNumberOrZero(playerStatistic[0]),
    yards: stringToNumberOrZero(playerStatistic[1]),
    yardsPerReturn: stringToNumberOrZero(playerStatistic[2]),
    longest: stringToNumberOrZero(playerStatistic[3]),
    touchdowns: stringToNumberOrZero(playerStatistic[4]),
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
) => Promise<PuntReturnStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.PuntReturnStatisticCreateInput = {
    returns: stringToNumberOrZero(playerStatistic[0]),
    yards: stringToNumberOrZero(playerStatistic[1]),
    yardsPerReturn: stringToNumberOrZero(playerStatistic[2]),
    longest: stringToNumberOrZero(playerStatistic[3]),
    touchdowns: stringToNumberOrZero(playerStatistic[4]),
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
) => Promise<KickingStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.KickingStatisticCreateInput = {
    fieldGoalAttempts: stringToNumberOrZero(
      playerStatistic[0]?.split("/")?.[0]
    ),
    fieldGoalMade: stringToNumberOrZero(playerStatistic[0]?.split("/")?.[1]),
    fieldGoalPct: stringToNumberOrZero(playerStatistic[1]),
    longest: stringToNumberOrZero(playerStatistic[2]),
    extraPointAttempts: stringToNumberOrZero(
      playerStatistic[3]?.split("/")?.[0]
    ),
    extraPointMade: stringToNumberOrZero(playerStatistic[3]?.split("/")?.[1]),
    totalPoints: stringToNumberOrZero(playerStatistic[4]),
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
) => Promise<PuntingStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.PuntingStatisticCreateInput = {
    punts: stringToNumberOrZero(playerStatistic[0]),
    yards: stringToNumberOrZero(playerStatistic[1]),
    yardsPerPunt: stringToNumberOrZero(playerStatistic[2]),
    touchbacks: stringToNumberOrZero(playerStatistic[3]),
    puntsInside20: stringToNumberOrZero(playerStatistic[4]),
    longest: stringToNumberOrZero(playerStatistic[5]),
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

const createBasketBallStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<BasketballStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.BasketballStatisticCreateInput = {
    minutes: stringToNumberOrZero(playerStatistic[0]),
    fieldGoalsMade: stringToNumberOrZero(playerStatistic[1]?.split("-")[0]),
    fieldGoalsAttempted: stringToNumberOrZero(
      playerStatistic[1]?.split("-")?.[1]
    ),
    threePointersAttempted: stringToNumberOrZero(
      playerStatistic[2]?.split("-")?.[0]
    ),
    threePointersMade: stringToNumberOrZero(
      playerStatistic[2]?.split("-")?.[1]
    ),
    freeThrowsAttempted: stringToNumberOrZero(
      playerStatistic[3]?.split("-")?.[0]
    ),
    freeThrowsMade: stringToNumberOrZero(playerStatistic[3]?.split("-")?.[1]),
    offensiveRebounds: stringToNumberOrZero(playerStatistic[4]),
    defensiveRebounds: stringToNumberOrZero(playerStatistic[5]),
    rebounds: stringToNumberOrZero(playerStatistic[6]),
    assists: stringToNumberOrZero(playerStatistic[7]),
    steals: stringToNumberOrZero(playerStatistic[8]),
    blocks: stringToNumberOrZero(playerStatistic[9]),
    turnovers: stringToNumberOrZero(playerStatistic[10]),
    fouls: stringToNumberOrZero(playerStatistic[11]),
    plusMinus: stringToNumberOrZero(playerStatistic[12]),
    points: stringToNumberOrZero(playerStatistic[13]),

    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamBasketballStatistic(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthleteBasketballStatistic(athleteId, gameId, statistic);
  }
};

const createSkaterStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<SkaterStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.SkaterStatisticCreateInput = {
    blockedShots: stringToNumberOrZero(playerStatistic[0]),
    hits: stringToNumberOrZero(playerStatistic[1]),
    takeaways: stringToNumberOrZero(playerStatistic[2]),
    plusMinus: stringToNumberOrZero(playerStatistic[3]),
    timeOnIce: playerStatistic[4] ?? "0:00",
    powerPlayTimeOnIce: playerStatistic[5] ?? "0:00",
    shortHandedTimeOnIce: playerStatistic[6] ?? "0:00",
    evenStrengthTimeOnIce: playerStatistic[7] ?? "0:00",
    shifts: stringToNumberOrZero(playerStatistic[8]),
    goals: stringToNumberOrZero(playerStatistic[9]),
    yearToDateGoals: stringToNumberOrZero(playerStatistic[10]),
    assists: stringToNumberOrZero(playerStatistic[11]),
    shots: stringToNumberOrZero(playerStatistic[12]),
    shotsMissed: stringToNumberOrZero(playerStatistic[13]),
    shootoutGoals: stringToNumberOrZero(playerStatistic[14]),
    faceOffsWon: stringToNumberOrZero(playerStatistic[15]),
    faceOffsLost: stringToNumberOrZero(playerStatistic[16]),
    faceOffPct: stringToNumberOrZero(playerStatistic[17]),
    giveaways: stringToNumberOrZero(playerStatistic[18]),
    penalties: stringToNumberOrZero(playerStatistic[19]),
    penaltyMinutes: stringToNumberOrZero(playerStatistic[20]),

    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamSkaterStatistic(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthleteSkaterStatistic(athleteId, gameId, statistic);
  }
};

const createGoalieStatistics: (
  playerStatistic: string[],
  gameId: string,
  teamId?: string,
  athleteId?: string
) => Promise<GoalieStatistic> = async (
  playerStatistic,
  gameId,
  teamId,
  athleteId
) => {
  if (!playerStatistic) return null;
  const statistic: Prisma.GoalieStatisticCreateInput = {
    goalsAgainst: stringToNumberOrZero(playerStatistic[0]),
    shotsAgainst: stringToNumberOrZero(playerStatistic[1]),
    shootoutSaves: stringToNumberOrZero(playerStatistic[2]),
    shootoutShotsAgainst: stringToNumberOrZero(playerStatistic[3]),
    saves: stringToNumberOrZero(playerStatistic[4]),
    savePct: stringToNumberOrZero(playerStatistic[5]),
    evenStrengthSaves: stringToNumberOrZero(playerStatistic[6]),
    powerPlaySaves: stringToNumberOrZero(playerStatistic[7]),
    shortHandedSaves: stringToNumberOrZero(playerStatistic[8]),
    timeOnIce: playerStatistic[9] ?? "0:00",
    yearToDateGoals: stringToNumberOrZero(playerStatistic[10]),
    penaltyMinutes: stringToNumberOrZero(playerStatistic[11]),

    gameId: gameId,
  };
  if (teamId) {
    statistic["teamId"] = teamId;
    return await upsertTeamGoalieStatistic(teamId, gameId, statistic);
  } else if (athleteId) {
    statistic["athleteId"] = athleteId;
    return await upsertAthleteGoalieStatistic(athleteId, gameId, statistic);
  }
};

const stringToNumberOrZero: (string: string) => number | null = (string) => {
  const value = parseFloat(string);
  if (!isNaN(value)) {
    return value;
  }
  return 0;
};

export const subtractFromTwentyMinutes = (time?: string): string => {
  if (!time) {
    return "20:00";
  }
  // Total time in seconds (20 minutes)
  const totalTimeInSeconds = 20 * 60;

  // Split the input time into minutes and seconds
  const [minutes, seconds] = time.split(":").map(Number);

  // Convert input time to seconds
  const inputTimeInSeconds = minutes * 60 + seconds;

  // Calculate remaining time
  const remainingTimeInSeconds = totalTimeInSeconds - inputTimeInSeconds;

  // Check if input time is more than 20 minutes
  if (remainingTimeInSeconds < 0) {
    throw new Error("Input time exceeds 20 minutes");
  }

  // Convert remaining time back to MM:SS format
  const remainingMinutes = Math.floor(remainingTimeInSeconds / 60);
  const remainingSeconds = remainingTimeInSeconds % 60;

  // Format the remaining time with leading zeros if necessary
  const formattedRemainingTime = `${remainingMinutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  return formattedRemainingTime;
};
