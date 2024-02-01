import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamPuntingStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.PuntingStatisticCreateInput
) => {
  return await prisma.puntingStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthletePuntingStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.PuntingStatisticCreateInput
) => {
  return await prisma.puntingStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
