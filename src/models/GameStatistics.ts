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

export const getGameStatistic = async (gameId: string) => {
  return await prisma.gameStatistic.findUnique({
    where: {
      gameId: gameId,
    },
    select: {
      Game: {
        select: {
          name: true,
        },
      },
      TeamGameStatistics: {
        select: {
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
        },
      },
      AthleteGameStatistics: {
        select: {
          Athlete: { select: { fullName: true } },
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
        },
      },
    },
  });
};
