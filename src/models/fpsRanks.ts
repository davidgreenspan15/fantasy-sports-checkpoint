import { Prisma } from "@prisma/client";

import { prisma } from "../index";

export const createFpsRank = async (data: Prisma.FpsRankCreateInput) => {
  try {
    return await prisma.fpsRank.create({
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
export const deleteAllFpsRanks = async () => {
  return await prisma.fpsRank.deleteMany({});
};
