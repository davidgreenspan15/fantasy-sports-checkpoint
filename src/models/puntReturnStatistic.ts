import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamPuntReturnStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.PuntReturnStatisticCreateInput
) => {
  return await prisma.puntReturnStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthletePuntReturnStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.PuntReturnStatisticCreateInput
) => {
  return await prisma.puntReturnStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
