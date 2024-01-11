import { Prisma } from "@prisma/client";

import { prisma } from "../index";
export const upsertTeamGame = async (game: Prisma.GameCreateInput) => {
  try {
    return await prisma.game.upsert({
      where: {
        leagueId_espnId: {
          leagueId: game.leagueId,
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
            leagueId_espnId: {
              leagueId: game.leagueId,
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
