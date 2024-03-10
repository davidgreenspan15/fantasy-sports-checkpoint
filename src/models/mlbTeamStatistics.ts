import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertMlbTeamStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.MlbTeamStatisticCreateInput
) => {
  return await prisma.mlbTeamStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
