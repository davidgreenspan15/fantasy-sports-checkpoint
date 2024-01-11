import { Prisma } from "@prisma/client";
import { Logger } from "winston";
import { prisma } from "../index";

export const upsertDepths = async (
  depth: Prisma.DepthCreateInput,
  logger: Logger
) => {
  const positionId = await prisma.position.findUnique({
    where: {
      espnId_leagueId: {
        espnId: depth.Positions.connectOrCreate[0].where.id,
        leagueId: depth.League.connect.id,
      },
    },
    select: {
      id: true,
    },
  });
  if (!positionId) {
    // console.log(depth.Positions.connectOrCreate[0].where.id);
  }
  const athleteId = await prisma.athlete.findUnique({
    where: {
      espnId_leagueId: {
        espnId: depth.Athletes.connect[0].id,
        leagueId: depth.League.connect.id,
      },
    },
    select: {
      id: true,
    },
  });
  if (!athleteId) {
    logger.error(depth.Athletes.connect[0].id, "missing athlete");
    return;
  }
  depth.Athletes.connect[0].id = athleteId?.id;
  depth.Positions.connectOrCreate[0].where.id = positionId?.id ?? "";
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
