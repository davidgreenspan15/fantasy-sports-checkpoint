import { Prisma } from "@prisma/client";

import { prisma } from "../index";

export const upsertDivisions = async (division: Prisma.DivisionCreateInput) => {
  try {
    return await prisma.division.upsert({
      where: {
        espnId_leagueId: {
          espnId: division.espnId,
          leagueId: division.League.connect.id,
        },
      },
      update: division,
      create: division,
    });
  } catch (err) {
    if (err.code === "P2002") {
      console.log(err);
    } else {
      throw err;
    }
  }
};
