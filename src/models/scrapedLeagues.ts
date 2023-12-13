import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getScrapedLeagues = async () => {
  const leagues = await prisma.scrapedLeague.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      teams: true,
    },
  });
  return leagues;
};

export const listScrapedLeagues = async () => {
  const leagues = await prisma.scrapedLeague.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      teams: {
        include: {
          players: {
            include: {
              fantasyProsData: true,
            },
          },
        },
      },
    },
  });
  return leagues;
};
