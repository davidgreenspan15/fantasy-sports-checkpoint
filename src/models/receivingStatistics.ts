import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamReceivingStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.ReceivingStatisticCreateInput
) => {
  return await prisma.receivingStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteReceivingStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.ReceivingStatisticCreateInput
) => {
  return await prisma.receivingStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
