import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamInterceptionStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.InterceptionStatisticsCreateInput
) => {
  return await prisma.interceptionStatistics.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteInterceptionStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.InterceptionStatisticsCreateInput
) => {
  return await prisma.interceptionStatistics.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
