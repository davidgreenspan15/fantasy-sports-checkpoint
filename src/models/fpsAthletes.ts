import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFpsAthletes = async (
  data: Prisma.FpsAthleteCreateManyInput[]
) => {
  return await prisma.fpsAthlete.createMany({
    data,
    skipDuplicates: true,
  });
};
