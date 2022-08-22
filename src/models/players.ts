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

export const listNflPlayersWithNoFPSData = async () => {
  const players = await prisma.player.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      AND: [
        {
          leagueId: 'ee2f5bc3-7eff-4c46-9cb4-48204dbdc22b',
          fantasyProsData: null,
        },
      ],
    },
    select: {
      id: true,
      name: true,
      injuryStatus: true,
      pos: true,
      depth: true,
      positionGroup: true,
      playerDepthPosition: true,
      playerImageSrc: true,
      height: true,
      weight: true,
      number: true,
      team: true,
      experience: true,
    },
  });
  return players;
};
