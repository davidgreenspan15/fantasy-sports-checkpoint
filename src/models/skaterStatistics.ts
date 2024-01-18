import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamSkaterStatistic = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.SkaterStatisticCreateInput
) => {
  return await prisma.skaterStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteSkaterStatistic = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.SkaterStatisticCreateInput
) => {
  return await prisma.skaterStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
