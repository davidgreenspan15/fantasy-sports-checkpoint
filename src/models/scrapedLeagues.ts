import { prisma } from "../index";

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
