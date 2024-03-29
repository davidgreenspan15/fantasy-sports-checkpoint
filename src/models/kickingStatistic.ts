import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamKickingStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.KickingStatisticCreateInput
) => {
  return await prisma.kickingStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteKickingStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.KickingStatisticCreateInput
) => {
  return await prisma.kickingStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
