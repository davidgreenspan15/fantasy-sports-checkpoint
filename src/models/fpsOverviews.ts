import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFpsOverview = async (
  data: Prisma.FpsOverviewCreateInput
) => {
  try {
    return await prisma.fpsOverview.create({
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
