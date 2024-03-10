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
                  PassingStatistic: true,
                  RushingStatistic: true,
                  ReceivingStatistic: true,
                  KickingStatistic: true,
                  PuntingStatistic: true,
                  KickReturnStatistic: true,
                  DefensiveStatistic: true,
                  FumbleStatistic: true,
                  InterceptionStatistic: true,
                  PuntReturnStatistic: true,
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
          MlbStatistic: {
            include: {
              AthleteTotalStatistics: {
                select: {
                  BattingStatistic: true,
                  PitchingStatistic: true,
                },
              },
            },
          },
        },
      },
      AthleteGameStatistics: {
        select: {
          athleteId: true,
          Athlete: {
            select: {
              id: true,
              displayName: true,
              imageUrl: true,
              teamId: true,
              Position: {
                select: {
                  name: true,
                  abbreviation: true,
                },
              },
            },
          },
          NflStatistic: {
            select: {
              PassingStatistic: true,
              RushingStatistic: true,
              ReceivingStatistic: true,
              KickingStatistic: true,
              PuntingStatistic: true,
              KickReturnStatistic: true,
              DefensiveStatistic: true,
              FumbleStatistic: true,
              InterceptionStatistic: true,
              PuntReturnStatistic: true,
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
          MlbStatistic: {
            select: {
              BattingStatistic: true,
              PitchingStatistic: true,
            },
          },
        },
      },
    },
  });

  return { gameStatistics, game };
};
