import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamPassingStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.PassingStatisticCreateInput
) => {
  return await prisma.passingStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthletePassingStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.PassingStatisticCreateInput
) => {
  return await prisma.passingStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
