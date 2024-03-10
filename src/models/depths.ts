import { Prisma } from "@prisma/client";
import { Logger } from "winston";
import { prisma } from "../index";

export const upsertDepths = async (
  depth: Prisma.DepthCreateInput,
  logger: Logger
) => {
  try {
    return await prisma.depth.upsert({
      where: {
        espnId_leagueId_depth: {
          espnId: depth.espnId,
          leagueId: depth.League.connect.id,
          depth: depth.depth,
        },
      },
      update: depth,
      create: depth,
    });
  } catch (e) {
    if (e.code === "P2002") {
      //Turn on when running new migration with new db
      // logger.error("Error", depth, e);
    } else {
      throw e;
    }
  }
};
