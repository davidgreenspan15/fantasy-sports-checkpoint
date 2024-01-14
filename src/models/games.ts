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

export const listAllNflGames = async () => {
  return await prisma.game.findMany({
    where: {
      League: {
        slug: "nfl",
      },
    },
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
    },
  });
};
