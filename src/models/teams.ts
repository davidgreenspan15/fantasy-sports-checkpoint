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

export const connectDivisionToTeam = async ({
  divisionId,
  leagueId,
  teamId,
}: {
  divisionId: string;
  leagueId: string;
  teamId: string;
}) => {
  return await prisma.team.update({
    where: {
      espnId_leagueId: { espnId: teamId, leagueId: leagueId },
    },
    data: {
      Division: {
        connect: {
          espnId_leagueId: { espnId: divisionId, leagueId: leagueId },
        },
      },
    },
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
export const listTeams = async () => {
  return await prisma.team.findMany({
    where: {
      League: { slug: "nfl" },
    },
  });
};
