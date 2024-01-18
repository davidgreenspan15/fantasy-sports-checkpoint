import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertNflAthleteStatisticStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.NflAthleteStatisticCreateInput
) => {
  return await prisma.nflAthleteStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertNflAthleteTotalStatisticStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.NflAthleteStatisticCreateInput
) => {
  return await prisma.nflAthleteStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
