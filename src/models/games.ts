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

export const listAllNflGames = async (gameIds: string[]) => {
  const whereClause = {
    League: {
      slug: "nfl",
    },
  };
  if (gameIds.length > 0) {
    whereClause["id"] = {
      in: gameIds,
    };
  }
  return await prisma.game.findMany({
    where: whereClause,
    select: {
      id: true,
      espnId: true,
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
