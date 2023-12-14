import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertTeamGame = async (teamGame: Prisma.TeamGamesCreateInput) => {
  return await prisma.teamGames.upsert({
    where: {
      id: teamGame.id,
    },
    update: teamGame,
    create: teamGame,
  });
};
