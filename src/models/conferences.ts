import { Prisma } from "@prisma/client";

import { prisma } from "../index";

export const upsertConferences = async (
  conference: Prisma.ConferenceCreateInput
) => {
  try {
    return await prisma.conference.upsert({
      where: {
        espnId_leagueId: {
          espnId: conference.espnId,
          leagueId: conference.League.connect.id,
        },
      },
      update: conference,
      create: conference,
    });
  } catch (err) {
    if (err.code === "P2002") {
      console.log(err);
    } else {
      throw err;
    }
  }
};
