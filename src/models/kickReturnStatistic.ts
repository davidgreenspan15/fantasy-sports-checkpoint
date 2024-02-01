import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamKickReturnStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.KickReturnStatisticCreateInput
) => {
  return await prisma.kickReturnStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteKickReturnStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.KickReturnStatisticCreateInput
) => {
  return await prisma.kickReturnStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
