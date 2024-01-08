import { Prisma } from "@prisma/client";

import { prisma } from "../index";

export const createFpsAverageStat = async (
  data: Prisma.FpsAverageStatCreateInput
) => {
  try {
    return await prisma.fpsAverageStat.create({
      data,
    });
  } catch (err) {
    if (err.code === "P2002" || err.code === "P2014") {
      console.log(err);
    } else {
      throw err;
    }
  }
};

export const deleteAllFpsAverageStats = async () => {
  return await prisma.fpsAverageStat.deleteMany({});
};
