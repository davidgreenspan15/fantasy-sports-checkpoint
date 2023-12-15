import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertAthletes = async (athlete: Prisma.AthleteCreateInput) => {
  return await prisma.athlete.upsert({
    where: {
      uid: athlete.uid,
    },
    update: athlete,
    create: athlete,
  });
};
