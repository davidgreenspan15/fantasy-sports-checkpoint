import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertAthletes = async (athlete: Prisma.AthleteCreateInput) => {
  return await prisma.athlete.upsert({
    where: {
      uid: athlete.uid,
    },
    update: athlete,
    create: athlete,
  });
};

export const upsertLeagueAthletes = async (
  athlete: Prisma.AthleteCreateInput
) => {
  //The current team connect id is the espnId to help find team id
  let team = await prisma.team.findUnique({
    where: {
      espnId_leagueId: {
        leagueId: athlete.league.connect.id,
        espnId: athlete?.team?.connect?.id,
      },
    },
  });
  // If team is not found, then the athlete is a free agent
  if (team) {
    athlete["team"] = { connect: { id: team.id } };
  } else {
    athlete.team = null;
  }

  return await prisma.athlete.upsert({
    where: {
      uid: athlete.uid,
    },
    update: athlete,
    create: athlete,
  });
};

export const listAthletesUid = async () => {
  return await prisma.athlete.findMany({
    select: {
      uid: true,
    },
  });
};
