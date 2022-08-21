import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLeagues = async () => {
  const leagues = await prisma.league.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      teams: true,
    },
  });
  return leagues;
};

export const listLeagues = async () => {
  const leagues = await prisma.league.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      teams: {
        include: {
          players: {
            include: {
              fantasyProsData: true,
            },
          },
        },
      },
    },
  });
  return leagues;
};
