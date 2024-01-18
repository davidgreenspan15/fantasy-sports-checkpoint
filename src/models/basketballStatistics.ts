import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamBasketballStatistic = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.BasketballStatisticCreateInput
) => {
  return await prisma.basketballStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteBasketballStatistic = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.BasketballStatisticCreateInput
) => {
  return await prisma.basketballStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
