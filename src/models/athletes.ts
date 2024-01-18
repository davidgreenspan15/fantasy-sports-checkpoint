import { Prisma } from "@prisma/client";
import { prisma } from "../index";

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
        leagueId: athlete.League.connect.id,
        espnId: athlete?.Team?.connect?.id,
      },
    },
  });
  // If team is not found, then the athlete is a free agent
  if (team) {
    athlete["Team"] = { connect: { id: team.id } };
  } else {
    athlete.Team = null;
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

export const listAthletes = async () => {
  return await prisma.athlete.findMany({});
};
