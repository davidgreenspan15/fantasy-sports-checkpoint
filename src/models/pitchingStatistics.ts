import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertTeamPitchingStatistic = async (
  teamId: string,
  gameId: string,
  statistics: Prisma.PitchingStatisticCreateInput
) => {
  return await prisma.pitchingStatistic.upsert({
    where: {
      gameId_teamId: { teamId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};

export const upsertAthletePitchingStatistic = async (
  athleteId: string,
  gameId: string,
  statistics: Prisma.PitchingStatisticCreateInput
) => {
  return await prisma.pitchingStatistic.upsert({
    where: {
      gameId_athleteId: { athleteId, gameId },
    },
    update: statistics,
    create: statistics,
  });
};
