import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertAthletes = async (team: Prisma.AthleteCreateInput) => {
  return await prisma.athlete.upsert({
    where: {
      uid: team.uid,
    },
    update: team,
    create: team,
  });
};
