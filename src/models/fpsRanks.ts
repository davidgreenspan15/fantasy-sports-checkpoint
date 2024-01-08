import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
