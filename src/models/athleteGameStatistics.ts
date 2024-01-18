import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertAthleteGameStatistics = async (
  athleteId: string,
  gameStatisticId: string,
  statistics: Prisma.AthleteGameStatisticCreateInput
) => {
  return await prisma.athleteGameStatistic.upsert({
    where: {
      gameStatisticId_athleteId: {
        athleteId: athleteId,
        gameStatisticId: gameStatisticId,
      },
    },
    update: statistics,
    create: statistics,
  });
};
