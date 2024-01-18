import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamDefensiveStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.DefensiveStatisticsCreateInput
) => {
  return await prisma.defensiveStatistics.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteDefensiveStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.DefensiveStatisticsCreateInput
) => {
  return await prisma.defensiveStatistics.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
