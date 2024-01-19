import { Prisma } from "@prisma/client";

import { prisma } from "../index";

export const upsertTeam = async (team: Prisma.TeamCreateInput) => {
  return await prisma.team.upsert({
    where: {
      uid: team.uid,
    },
    update: team,
    create: team,
  });
};

export const listTeamsWithLeagueSportSlugAndId = async () => {
  return await prisma.team.findMany({
    select: {
      espnId: true,
      id: true,
      name: true,
      League: {
        select: {
          id: true,
          sport: true,
          slug: true,
        },
      },
    },
  });
};

const listTeamsWithLeagueIds = async () => {
  return await prisma.team.findMany({
    select: {
      id: true,
      name: true,
      abbreviation: true,
      displayName: true,
      League: {
        select: {
          slug: true,
          id: true,
        },
      },
    },
  });
};
