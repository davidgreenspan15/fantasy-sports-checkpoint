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
  return await prisma.gameStatistic.findUnique({
    where: {
      gameId: gameId,
    },
    select: {
      Game: {
        select: {
          id: true,
          name: true,
          espnId: true,
        },
      },
      TeamGameStatistics: {
        select: {
          Team: {
            select: {
              displayName: true,
            },
          },
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
          NbStatistic: {
            include: {
              AthleteTotalStatistics: {
                select: {
                  BasketballStatistic: true,
                },
              },
            },
          },
        },
      },
      AthleteGameStatistics: {
        select: {
          Athlete: {
            select: { fullName: true, Team: { select: { displayName: true } } },
          },
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
        },
      },
    },
  });
};
