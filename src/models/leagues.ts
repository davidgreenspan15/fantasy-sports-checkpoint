import { Prisma } from "@prisma/client";

import { prisma } from "../index";

export const createLeagues = async (leagues: Prisma.LeagueCreateInput[]) => {
  const ls = await prisma.league.createMany({
    data: leagues,
    skipDuplicates: true,
  });

  return ls;
};

export const createLeague = async (league: Prisma.LeagueCreateInput) => {
  const l = await prisma.league.create({
    data: league,
  });

  return l;
};

export const listLeagues = async () => {
  const ls = await prisma.league.findMany();

  return ls;
};

export const listLeaguesWithAthleteEspnIds = async () => {
  const ls = await prisma.league.findMany({
    include: {
      Athletes: {
        select: {
          espnId: true,
          imageUrl: true,
        },
      },
    },
  });

  return ls;
};

export const listLeaguesWithTeams = async () => {
  const ls = await prisma.league.findMany({
    select: {
      id: true,
      name: true,
      shortName: true,
      abbreviation: true,
      Teams: {
        select: {
          id: true,
          name: true,
          abbreviation: true,
          displayName: true,
          location: true,
          imageUrl: true,
          color: true,
          alternateColor: true,
          Games: {
            select: {
              Season: {
                select: {
                  displayYear: true,
                  type: true,
                  name: true,
                },
              },
            },
          },
          Roster: {
            select: {
              Season: {
                select: {
                  displayYear: true,
                  type: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return ls;
};
