import { Prisma } from "@prisma/client";

import { prisma } from "../index";

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
export const deleteAllFpsOverviews = async () => {
  return await prisma.fpsOverview.deleteMany({});
};
