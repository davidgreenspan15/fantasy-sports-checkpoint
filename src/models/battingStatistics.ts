import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamBattingStatistic = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.BattingStatisticCreateInput
) => {
  return await prisma.battingStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteBattingStatistic = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.BattingStatisticCreateInput
) => {
  return await prisma.battingStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
