import { Prisma, PrismaClient } from "@prisma/client";
import { Logger } from "winston";

const prisma = new PrismaClient();

export const upsertDepths = async (
  depth: Prisma.DepthCreateInput,
  logger: Logger
) => {
  const positionId = await prisma.position.findUnique({
    where: {
      espnId_leagueId: {
        espnId: depth.positions.connectOrCreate[0].where.id,
        leagueId: depth.league.connect.id,
      },
    },
    select: {
      id: true,
    },
  });
  if (!positionId) {
    console.log(depth.positions.connectOrCreate[0].where.id);
  }
  const athleteId = await prisma.athlete.findUnique({
    where: {
      espnId_leagueId: {
        espnId: depth.athletes.connect[0].id,
        leagueId: depth.league.connect.id,
      },
    },
    select: {
      id: true,
    },
  });
  if (!athleteId) {
    logger.error(depth.athletes.connect[0].id, "missing athlete");
    return;
  }
  depth.athletes.connect[0].id = athleteId?.id;
  depth.positions.connectOrCreate[0].where.id = positionId?.id ?? "";
  try {
    return await prisma.depth.upsert({
      where: {
        espnId_leagueId_depth: {
          espnId: depth.espnId,
          leagueId: depth.league.connect.id,
          depth: depth.depth,
        },
      },
      update: depth,
      create: depth,
    });
  } catch (e) {
    if (e.code === "P2002") {
      logger.error("Error", depth, e);
    } else {
      throw e;
    }
  }
};
