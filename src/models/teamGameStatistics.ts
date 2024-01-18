import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamGameStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.TeamGameStatisticCreateInput
) => {
  return await prisma.teamGameStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
