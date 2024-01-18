import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertNflTeamStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.NflTeamStatisticCreateInput
) => {
  return await prisma.nflTeamStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
