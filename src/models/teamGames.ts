import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertTeamGame = async (teamGame: Prisma.TeamGameCreateInput) => {
  const game = await prisma.game.findUnique({
    where: {
      leagueId_espnId: {
        leagueId: teamGame.game.connectOrCreate.create.leagueId,
        espnId: teamGame.game.connectOrCreate.create.espnId,
      },
    },
  });

  return await prisma.teamGame.upsert({
    where: {
      teamId_gameId: {
        teamId: teamGame.team.connect.id,
        gameId: game.id ?? "",
      },
    },
    update: teamGame,
    create: teamGame,
  });
};
