import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const upsertTeamGame = async (teamGame: Prisma.TeamGameCreateInput) => {
  const espnGameId = teamGame.game.connectOrCreate.where.leagueId_espnId.espnId;
  const leagueId = teamGame.game.connectOrCreate.where.leagueId_espnId.leagueId;

  const game = await prisma.game.findUnique({
    where: {
      leagueId_espnId: {
        leagueId: leagueId,
        espnId: espnGameId,
      },
    },
  });

  if (game) {
    teamGame.game.connectOrCreate.where.id === game.id;
  }
  try {
    return await prisma.teamGame.upsert({
      where: {
        teamId_gameId: {
          teamId: teamGame.team.connect.id,
          gameId: game?.id ?? "",
        },
      },
      update: teamGame,
      create: teamGame,
    });
  } catch (e) {
    if (e.code === "P2002") {
      console.log(e);
    } else {
      throw e;
    }
  }
};
