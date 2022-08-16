import { Prisma, PrismaClient, Team } from '@prisma/client';

const prisma = new PrismaClient();

export const createPlayers = async (
  players: Prisma.PlayerCreateManyInput[]
) => {
  const ps = await prisma.player.createMany({
    data: players,
    skipDuplicates: true,
  });

  return ps;
};

export const listPlayers = async () => {
  const players = await prisma.player.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return players;
};
