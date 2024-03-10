import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertMlbAthleteStatisticStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.MlbAthleteStatisticCreateInput
) => {
  return await prisma.mlbAthleteStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertMlbAthleteTotalStatisticStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.MlbAthleteStatisticCreateInput
) => {
  return await prisma.mlbAthleteStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
