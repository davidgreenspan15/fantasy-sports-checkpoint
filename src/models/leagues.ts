import { League, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
