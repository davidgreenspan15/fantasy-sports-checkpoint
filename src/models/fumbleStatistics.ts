import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamFumbleStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.FumbleStatisticCreateInput
) => {
  return await prisma.fumbleStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteFumbleStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.FumbleStatisticCreateInput
) => {
  return await prisma.fumbleStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
