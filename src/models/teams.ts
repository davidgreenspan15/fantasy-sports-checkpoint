import { Prisma, PrismaClient, Team } from '@prisma/client';

const prisma = new PrismaClient();

export const createTeams = async (teams: Prisma.TeamCreateManyInput[]) => {
  const ts = await prisma.team.createMany({
    data: teams,
    skipDuplicates: true,
  });

  return ts;
};

export const updateTeams = async (teams: Prisma.TeamUpdateInput[]) => {
  const response = await Promise.all(
    teams.map(async t => {
      delete t.players;
      try {
        const ts = await prisma.team.update({
          data: t,
          where: {
            id: t.id as string,
          },
        });
        return ts;
      } catch (err) {
        console.error(err);
        return err;
      }
    })
  );

  return teams;
};

export const listTeams = async () => {
  const leagues = await prisma.team.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      players: true,
    },
  });
  return leagues;
};
