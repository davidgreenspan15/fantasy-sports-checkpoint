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
        espnId: athlete?.Team?.connect?.id ?? "",
      },
    },
  });
  // If team is not found, then the athlete is a free agent
  if (team) {
    athlete["Team"] = { connect: { id: team.id } };
  } else {
    athlete.Team = undefined;
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

export const listTeamAthletes = async (teamId?: string) => {
  const select = {
    uid: true,
    firstName: true,
    lastName: true,
    displayName: true,
    imageUrl: true,
    number: true,
    Position: {
      select: {
        displayName: true,
        parentId: true,
      },
    },
  };
  if (!teamId) {
    return await prisma.athlete.findMany({
      select,
    });
  }
  return await prisma.athlete.findMany({
    where: {
      Team: {
        id: teamId,
      },
    },
    select,
  });
};

export const getAthleteById = async (id) => {
  return await prisma.athlete.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      displayName: true,
      imageUrl: true,
      number: true,
      teamId: true,
      Position: {
        select: {
          displayName: true,
          parentId: true,
        },
      },
    },
  });
};

export const getAthletesById = async (ids: string[]) => {
  return await prisma.athlete.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      uid: true,
      firstName: true,
      lastName: true,
      id: true,
      displayName: true,
      imageUrl: true,
      number: true,
      teamId: true,
      Position: {
        select: {
          displayName: true,
          parentId: true,
        },
      },
    },
  });
};
