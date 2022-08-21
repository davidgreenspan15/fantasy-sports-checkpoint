import { Prisma, PrismaClient, Team } from '@prisma/client';

const prisma = new PrismaClient({ log: ['info', 'warn', 'error'] });

export const createFantasyProsPlayers = async (
  players: Prisma.FantasyProsDataCreateManyInput[]
) => {
  const ps = await prisma.fantasyProsData.createMany({
    data: players,
    skipDuplicates: true,
  });

  return ps;
};

export const getFPSPlayersForDraft = async () => {
  const ps = await prisma.fantasyProsData.findMany({
    orderBy: {
      rank: 'asc',
    },
    include: {
      player: {
        select: {
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
      },
    },
  });

  return ps;
};
