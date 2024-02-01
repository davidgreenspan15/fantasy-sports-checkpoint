import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamRushingStatistics = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.RushingStatisticCreateInput
) => {
  return await prisma.rushingStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteRushingStatistics = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.RushingStatisticCreateInput
) => {
  return await prisma.rushingStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
