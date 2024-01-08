import { Prisma } from "@prisma/client";

import { prisma } from "../index";

export const createFpsAthletes = async (
  data: Prisma.FpsAthleteCreateManyInput[]
) => {
  return await prisma.fpsAthlete.createMany({
    data,
    skipDuplicates: true,
  });
};
export const deleteAllFpsAthletes = async () => {
  return await prisma.fpsAthlete.deleteMany({});
};
