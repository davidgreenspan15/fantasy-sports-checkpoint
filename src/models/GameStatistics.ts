import { Prisma } from "@prisma/client";
import { prisma } from "..";
import { findTeamRoster } from "./rosters";
import { getGameById } from "./games";

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
  const game = await getGameById(gameId);
  const gameStatistics = await prisma.gameStatistic.findUnique({
    where: {
      gameId: gameId,
    },
    select: {
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

  return { gameStatistics, game };
};
