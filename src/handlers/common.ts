import { find, omit } from "lodash";
import { prisma } from "..";
import { getGameStatistic } from "../models/GameStatistics";
import { getFPSPlayersForDraft } from "../models/fantasaySportsData";
import { listLeaguesWithTeams } from "../models/leagues";
import { listNflScrapedPlayersWithNoFPSData } from "../models/scrapedPlayers";
import { mergeValues } from "../util/normalizePlayers";
import { migrateGameStatistics } from "./espnApiV2";
import moment from "moment";

export const resetData = async () => {
  await prisma.fantasyProsData.deleteMany({});
  await prisma.scrapedPlayer.deleteMany({});
  await prisma.scrapedGame.deleteMany({});
  await prisma.scrapedTeam.deleteMany({});
};

export const todaysBirthday = async (date?: Date) => {
  const dateMoment = date ? moment(date) : moment();
  const athletes = await prisma.athlete.findMany({
    where: {
      birthday: {
        startsWith: dateMoment.format("M/D/"),
      },
    },
    select: {
      fullName: true,
      dateOfBirth: true,
      birthday: true,
      espnUrl: true,
      imageUrl: true,
      Position: {
        select: {
          name: true,
          abbreviation: true,
        },
      },
      League: {
        select: {
          abbreviation: true,
        },
      },
      Team: {
        select: {
          id: true,
          name: true,
          abbreviation: true,
        },
      },
    },
  });

  const games = await prisma.game.findMany({
    where: {
      AND: [
        {
          date: {
            gte: dateMoment.startOf("day").toDate(),
          },
        },
        {
          date: {
            lt: dateMoment.endOf("day").toDate(), // 24 hours later for less than comparison
          },
        },
      ],
    },
    select: {
      date: true,
      name: true,
      week: true,
      homeTeamId: true,
      awayTeamId: true,
      AwayTeam: {
        select: {
          id: true,
          name: true,
          abbreviation: true,
          imageUrl: true,
        },
      },
      HomeTeam: {
        select: {
          id: true,
          name: true,
          abbreviation: true,
          imageUrl: true,
        },
      },
    },
  });

  // Return Athletes with a game today

  const playersWithBirthdayAndGame = [];
  athletes.forEach((a) => {
    const game = games.find((g) => {
      return g.homeTeamId === a.Team?.id || g.awayTeamId === a.Team?.id;
    });
    if (game) {
      playersWithBirthdayAndGame.push({
        ...a,
        game,
      });
    }
  });

  return playersWithBirthdayAndGame;
};

export const getSeasonBirthdayStats = async () => {
  const games = await prisma.game.findMany({
    where: {
      OR: [
        {
          League: { abbreviation: "NFL" },
          Season: { displayYear: "2023", type: 2 },
        },
        {
          League: { abbreviation: "NHL" },
          Season: { displayYear: "2023-24", type: 2 },
        },
      ],
    },
    select: {
      date: true,
      id: true,
      Statistics: {
        select: {
          AthleteGameStatistics: {
            where: {
              OR: [
                {
                  NflStatistic: {
                    RushingStatistic: {
                      attempts: {
                        gt: 0,
                      },
                    },
                  },
                },
                {
                  NflStatistic: {
                    ReceivingStatistic: {
                      targets: {
                        gt: 0,
                      },
                    },
                  },
                },
                {
                  NhlStatistic: {
                    SkaterStatistic: {
                      isNot: null,
                    },
                  },
                },
              ],
            },
            select: {
              athleteId: true,
              id: true,
              NflStatistic: {
                select: {
                  RushingStatistic: {
                    select: {
                      touchdowns: true,
                    },
                  },
                  ReceivingStatistic: {
                    select: {
                      touchdowns: true,
                    },
                  },
                },
              },
              NhlStatistic: {
                select: {
                  SkaterStatistic: {
                    select: {
                      goals: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const resp = await Promise.all(
    games.map(async (g) => {
      const athletes = await prisma.athlete.findMany({
        where: {
          id: {
            in: g.Statistics?.AthleteGameStatistics.map((ags) => ags.athleteId),
          },
          birthday: { startsWith: moment(g.date).format("M/D/") },
        },
        include: {
          Position: {
            select: {
              displayName: true,
            },
          },
        },
      });
      return { game: g, athletes };
    })
  );

  const filteredResp = resp.filter((r) => r.athletes.length > 0);
  const allowedPositions = [
    "Running Back",
    "Wide Receiver",
    "Tight End",
    "Left Wing",
    "Right Wing",
    "Center",
    "Defense",
    "Quarterback",
  ];
  const positionStats = filteredResp.reduce((acc, r) => {
    r.athletes.forEach((a) => {
      if (!a.Position) return;
      if (!allowedPositions.includes(a.Position.displayName)) return;
      if (!acc[a.Position.displayName]) {
        acc[a.Position.displayName] = {
          touchdowns: 0,
          games: 0,
        };
      }
      const stats = r.game.Statistics?.AthleteGameStatistics.find(
        (ags) => ags.athleteId === a.id
      );
      if (stats) {
        if (stats.NflStatistic?.RushingStatistic?.touchdowns > 0) {
          acc[a.Position.displayName].touchdowns += 1;
        }
        if (stats.NflStatistic?.ReceivingStatistic?.touchdowns > 0) {
          acc[a.Position.displayName].touchdowns += 1;
        }
        if (stats.NhlStatistic?.SkaterStatistic?.goals > 0) {
          if (!acc[a.Position.displayName].goals) {
            acc[a.Position.displayName].goals = 0;
          }
          acc[a.Position.displayName].goals += 1;
        }
        acc[a.Position.displayName].games += 1;
      }
    });
    return acc;
  }, {} as Record<string, { touchdowns: number; games: number; goals?: number }>);

  return positionStats;
};

export const getDraftBoard = async () => {
  const fpsPlayers = await getFPSPlayersForDraft();
  const playersWithNoFps = await listNflScrapedPlayersWithNoFPSData();
  return mergeValues(playersWithNoFps, fpsPlayers);
};

export const getLeaguesWithTeams = async () => {
  const lT = await listLeaguesWithTeams();

  // create unique list of Season displayYear and Type for each team
  const mappedLt = lT.map((l) => {
    l.Teams.map((t) => {
      const GameSeason = { displayYears: [], types: [] };
      const gameDisplayYearHash = {};
      const gameTypeHash = {};
      [...t.AwayGames, ...t.HomeGames].forEach((g) => {
        gameDisplayYearHash[g.Season.displayYear] = g.Season.displayYear;
        gameTypeHash[g.Season.type] = {
          name: g.Season.name,
          type: g.Season.type,
        };
      });
      GameSeason.displayYears = Object.keys(gameDisplayYearHash);
      GameSeason.types = Object.values(gameTypeHash);

      const RosterSeason = { displayYears: [], types: [] };
      const rosterDisplayYearHash = {};
      const rosterTypeHash = {};
      t.Roster.forEach((r) => {
        rosterDisplayYearHash[r.Season.displayYear] = r.Season.displayYear;
        rosterTypeHash[r.Season.type] = {
          name: r.Season.name,
          type: r.Season.type,
        };
      });
      RosterSeason.displayYears = Object.keys(rosterDisplayYearHash);
      RosterSeason.types = Object.values(rosterTypeHash);
      t["GameSeason"] = GameSeason;
      t["RosterSeason"] = RosterSeason;
      delete t.Roster;
      delete t.AwayGames;
      delete t.HomeGames;

      return t;
    });
    return l;
  });
  return mappedLt;
};

export const getGameStatistics = async (
  gameId: string,
  shouldMigrateGame: boolean
) => {
  if (shouldMigrateGame) {
    await migrateGameStatistics([gameId], undefined, undefined);
  }
  const { gameStatistics, game } = await getGameStatistic(gameId);

  const mappedGameStatistics = {
    timeOnClock: game.timeOnClock,
    period: game.period,
    teams: [],
    isComplete: game.isComplete,
  };

  const homeTeam = {
    ...game.HomeTeam,
    timeOnClock: game.timeOnClock,
    period: game.period,
    isHome: true,
    TeamStatistics: gameStatistics?.TeamGameStatistics.find((tgs) => {
      return tgs.teamId === game.HomeTeam.id;
    }),
  };
  const awayTeam = {
    ...game.AwayTeam,
    timeOnClock: game.timeOnClock,
    period: game.period,
    isHome: false,
    TeamStatistics: gameStatistics?.TeamGameStatistics.find((tgs) => {
      return tgs.teamId === game.AwayTeam.id;
    }),
  };

  homeTeam["athletesStatistics"] = mapAthleteStats(
    gameStatistics?.AthleteGameStatistics,
    game.HomeTeam.id
  );

  awayTeam["athletesStatistics"] = mapAthleteStats(
    gameStatistics?.AthleteGameStatistics,
    game.AwayTeam.id
  );

  mappedGameStatistics.teams.push(homeTeam, awayTeam);

  return mappedGameStatistics;
};

const mapAthleteStats = (athleteStats, teamId) => {
  return athleteStats?.reduce((acc, a) => {
    if (a.Athlete.teamId !== teamId) return acc;
    Object.keys(a).forEach((key) => {
      if (key != "athleteId" && key != "Athlete") {
        const v = a[key];
        if (v && typeof v === "object") {
          Object.keys(v).forEach((k) => {
            if (v[k] !== null) {
              const stats = omit(v[k], ["athleteId", "gameId", "id"]);
              if (!acc[k]) {
                const athleteStats = {
                  athleteId: a.athleteId,
                  displayName: a.Athlete.displayName,
                  imageUrl: a.Athlete.imageUrl,
                  position: a.Athlete.Position.abbreviation,
                  ...stats,
                };
                acc[k] = [athleteStats];
              } else {
                const athleteStats = {
                  athleteId: a.athleteId,
                  displayName: a.Athlete.displayName,
                  imageUrl: a.Athlete.imageUrl,
                  position: a.Athlete.Position?.abbreviation, // Need to investigate why athlete does not have position
                  ...stats,
                };
                acc[k].push(athleteStats);
              }
            }
          });
        }
      }
    });
    return acc;
  }, {});
};
