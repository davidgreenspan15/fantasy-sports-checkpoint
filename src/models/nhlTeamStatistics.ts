import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertNhlTeamStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.NhlTeamStatisticCreateInput
) => {
  return await prisma.nhlTeamStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
