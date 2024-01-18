import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertNbaTeamStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.NbaTeamStatisticCreateInput
) => {
  return await prisma.nbaTeamStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
