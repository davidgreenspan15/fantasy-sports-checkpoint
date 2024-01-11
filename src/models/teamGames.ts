import { Prisma } from "@prisma/client";

import { prisma } from "../index";
export const upsertTeamGame = async (teamGame: Prisma.TeamGameCreateInput) => {
  const espnGameId = teamGame.Game.connectOrCreate.where.leagueId_espnId.espnId;
  const leagueId = teamGame.Game.connectOrCreate.where.leagueId_espnId.leagueId;
  const game = await prisma.game.findUnique({
    where: {
      leagueId_espnId: {
        leagueId: leagueId,
        espnId: espnGameId,
      },
    },
  });

  if (game) {
    teamGame.Game.connectOrCreate.where.id === game.id;
  }
  try {
    return await prisma.teamGame.upsert({
      where: {
        leagueId_teamId_gameId: {
          leagueId: teamGame.leagueId,
          teamId: teamGame.Team.connect.id,
          gameId: game?.id ?? "",
        },
      },
      update: teamGame,
      create: teamGame,
    });
  } catch (e) {
    if (e.code === "P2002") {
      console.log(e);
      try {
        return await prisma.teamGame.upsert({
          where: {
            leagueId_teamId_gameId: {
              leagueId: teamGame.leagueId,
              teamId: teamGame.Team.connect.id,
              gameId: game?.id ?? "",
            },
          },
          update: teamGame,
          create: teamGame,
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
