import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertGameStatistics = async (
  gameId: string,
  statistics: Prisma.GameStatisticCreateInput
) => {
  return await prisma.gameStatistic.upsert({
    where: {
      gameId: gameId,
    },
    update: statistics,
    create: statistics,
  });
};

export const updateGameStatisticsIsComplete = async (id: string) => {
  return await prisma.gameStatistic.update({
    where: {
      id: id,
    },
    data: {
      isComplete: true,
    },
  });
};

export const getGameStatistic = async (gameId: string) => {
  const gameStatistics = await prisma.gameStatistic.findUnique({
    where: {
      gameId: gameId,
    },
    select: {
      Game: {
        select: {
          id: true,
          name: true,
          espnId: true,
          seasonId: true,
          Teams: {
            select: { id: true },
          },
        },
      },

      TeamGameStatistics: {
        select: {
          teamScore: true,
          teamId: true,
          NflStatistic: {
            include: {
              AthleteTotalStatistics: {
                select: {
                  PassingStatistics: true,
                  RushingStatistics: true,
                  ReceivingStatistics: true,
                  KickingStatistics: true,
                  PuntingStatistics: true,
                  KickReturnStatistics: true,
                  DefensiveStatistics: true,
                  FumbleStatistics: true,
                  InterceptionStatistics: true,
                  PuntReturnStatistics: true,
                },
              },
            },
          },
          NbaStatistic: {
            include: {
              AthleteTotalStatistics: {
                select: {
                  BasketballStatistic: true,
                },
              },
            },
          },
          NhlStatistic: {
            include: {
              AthleteTotalStatistics: {
                select: {
                  SkaterStatistic: true,
                  GoalieStatistic: true,
                },
              },
            },
          },
        },
      },
      AthleteGameStatistics: {
        select: {
          athleteId: true,
          NflStatistic: {
            select: {
              PassingStatistics: true,
              RushingStatistics: true,
              ReceivingStatistics: true,
              KickingStatistics: true,
              PuntingStatistics: true,
              KickReturnStatistics: true,
              DefensiveStatistics: true,
              FumbleStatistics: true,
              InterceptionStatistics: true,
              PuntReturnStatistics: true,
            },
          },
          NbaStatistic: {
            select: {
              BasketballStatistic: true,
            },
          },
          NhlStatistic: {
            select: {
              SkaterStatistic: true,
              GoalieStatistic: true,
            },
          },
        },
      },
    },
  });
  const rosters = await prisma.roster.findMany({
    where: {
      Season: {
        id: gameStatistics?.Game?.seasonId,
      },
      OR: [
        {
          Team: {
            id: gameStatistics?.Game?.Teams[0].id,
          },
        },

        {
          Team: {
            id: gameStatistics?.Game?.Teams[1].id,
          },
        },
      ],
    },
    select: {
      Team: {
        select: {
          id: true,
          displayName: true,
        },
      },
      Athletes: {
        select: {
          id: true,
          displayName: true,
          imageUrl: true,
          number: true,
          Position: {
            select: {
              displayName: true,
              parentPositionId: true,
            },
          },
        },
      },
    },
  });

  return { gameStatistics, rosters };
};
