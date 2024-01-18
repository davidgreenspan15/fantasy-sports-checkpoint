import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamGoalieStatistic = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.GoalieStatisticCreateInput
) => {
  return await prisma.goalieStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthleteGoalieStatistic = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.GoalieStatisticCreateInput
) => {
  return await prisma.goalieStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
