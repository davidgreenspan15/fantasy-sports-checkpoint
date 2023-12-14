import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertTeam = async (team: Prisma.TeamCreateInput) => {
  return await prisma.team.upsert({
    where: {
      uid: team.uid,
    },
    update: team,
    create: team,
  });
};
