import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertNbaAthleteStatisticStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.NbaAthleteStatisticCreateInput
) => {
  return await prisma.nbaAthleteStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertNbaAthleteTotalStatisticStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.NbaAthleteStatisticCreateInput
) => {
  return await prisma.nbaAthleteStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
