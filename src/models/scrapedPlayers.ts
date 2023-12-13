import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createScrapedPlayers = async (
  players: Prisma.ScrapedPlayerCreateManyInput[]
) => {
  const ps = await prisma.scrapedPlayer.createMany({
    data: players,
    skipDuplicates: true,
  });

  return ps;
};

export const updateScrapedPlayers = async (
  players: Prisma.ScrapedPlayerUpdateInput[]
) => {
  const response = await Promise.all(
    players.map(async (p) => {
      const ps = await prisma.scrapedPlayer.update({
        data: p,
        where: { id: p.id as string },
      });
      return ps;
    })
  );
  return response;
};

export const listScrapedPlayers = async () => {
  const players = await prisma.scrapedPlayer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return players;
};

export const listScrapedLeaguesPlayers = async (leagues: string[]) => {
  const whereClause = leagues.map((l) => {
    return { team: { league: { abr: l } } };
  });
  const players = await prisma.scrapedPlayer.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: { OR: whereClause, birthDate: null },
  });
  return players;
};

export const listNflScrapedPlayersWithNoFPSData = async () => {
  const players = await prisma.scrapedPlayer.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      AND: [
        {
          leagueId: "ee2f5bc3-7eff-4c46-9cb4-48204dbdc22b",
          fantasyProsData: null,
        },
      ],
    },
    select: {
      id: true,
      name: true,
      injuryStatus: true,
      pos: true,
      depth: true,
      positionGroup: true,
      playerDepthPosition: true,
      playerImageSrc: true,
      height: true,
      weight: true,
      number: true,
      team: true,
      experience: true,
    },
  });
  return players;
};
