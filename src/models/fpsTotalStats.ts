import { Prisma } from "@prisma/client";

import { prisma } from "../index";

export const createFpsTotalStat = async (
  data: Prisma.FpsTotalStatCreateInput
) => {
  try {
    return await prisma.fpsTotalStat.create({
      data,
    });
  } catch (err) {
    if (err.code === "P2002" || err.code === "P2014") {
      // console.log(err);
    } else {
      throw err;
    }
  }
};
export const deleteAllFpsTotalStats = async () => {
  return await prisma.fpsTotalStat.deleteMany({});
};
