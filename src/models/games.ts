import { Prisma } from "@prisma/client";

import { prisma } from "../index";
export const upsertTeamGame = async (game: Prisma.GameCreateInput) => {
  try {
    return await prisma.game.upsert({
      where: {
        espnId_leagueId: {
          leagueId: game.League.connect.id,
          espnId: game.espnId,
        },
      },
      update: game,
      create: game,
    });
  } catch (e) {
    if (e.code === "P2002") {
      try {
        return await prisma.game.upsert({
          where: {
            espnId_leagueId: {
              leagueId: game.League.connect.id,
              espnId: game.espnId,
            },
          },
          update: game,
          create: game,
        });
      } catch (e) {
        if (e.code === "P2002") {
          console.log(e);
        }
      }
    } else {
      throw e;
    }
  }
};

export const listAllNflGames = async (
  gameIds: string[],
  isGameComplete?: boolean,
  isGameStatisticComplete?: boolean
) => {
  const whereClause = {
    League: {
      OR: [{ slug: "nba" }, { slug: "nfl" }, { slug: "nhl" }],
    },
  };
  if (gameIds.length > 0) {
    whereClause["id"] = {
      in: gameIds,
    };
  }
  if (isGameComplete) {
    whereClause["isComplete"] = true;
  }
  if (isGameStatisticComplete === true) {
    whereClause["Statistics"] = {
      isComplete: true,
    };
  } else if (isGameStatisticComplete === false) {
    whereClause["OR"] = [
      { Statistics: null },
      {
        Statistics: {
          isComplete: false,
        },
      },
    ];
  }
  return await prisma.game.findMany({
    where: whereClause,
    select: {
      id: true,
      espnId: true,
      isComplete: true,
      awayTeamId: true,
      homeTeamId: true,
      League: {
        select: {
          slug: true,
          sport: true,
          id: true,
        },
      },
      Teams: { select: { espnId: true, id: true } },
      Statistics: {
        select: {
          id: true,
          isComplete: true,
          TeamGameStatistics: {
            select: {
              id: true,
              NflStatistic: {
                select: {
                  id: true,
                  AthleteTotalStatistics: {
                    select: {
                      id: true,
                      PassingStatistics: { select: { id: true } },
                      RushingStatistics: { select: { id: true } },
                      ReceivingStatistics: { select: { id: true } },
                      KickingStatistics: { select: { id: true } },
                      PuntingStatistics: { select: { id: true } },
                      KickReturnStatistics: { select: { id: true } },
                      PuntReturnStatistics: { select: { id: true } },
                      DefensiveStatistics: { select: { id: true } },
                      FumbleStatistics: { select: { id: true } },
                      InterceptionStatistics: { select: { id: true } },
                    },
                  },
                },
              },
            },
          },
          AthleteGameStatistics: {
            select: {
              id: true,
              NflStatistic: {
                select: {
                  id: true,
                  PassingStatistics: { select: { id: true } },
                  RushingStatistics: { select: { id: true } },
                  ReceivingStatistics: { select: { id: true } },
                  KickingStatistics: { select: { id: true } },
                  PuntingStatistics: { select: { id: true } },
                  KickReturnStatistics: { select: { id: true } },
                  PuntReturnStatistics: { select: { id: true } },
                  DefensiveStatistics: { select: { id: true } },
                  FumbleStatistics: { select: { id: true } },
                  InterceptionStatistics: { select: { id: true } },
                },
              },
            },
          },
        },
      },
    },
  });
};

export const listTeamGames = async (
  seasonDisplayName: string,
  seasonType: number,
  teamId?: string
) => {
  const select = {
    id: true,
    espnId: true,
    date: true,
    name: true,
    shortName: true,
    week: true,
    isComplete: true,
    homeTeamId: true,
    awayTeamId: true,
  };
  const where = {
    Season: { displayYear: seasonDisplayName, type: seasonType },
  };

  if (!teamId) {
    return await prisma.game.findMany({
      where,
      select,
      orderBy: { date: "asc" },
    });
  }
  return await prisma.game.findMany({
    where: { ...where, Teams: { some: { id: teamId } } },
    select,
    orderBy: { date: "asc" },
  });
};
