import { Prisma } from "@prisma/client";
import logger from "../util/logger";

import { prisma } from "../index";

export const createScrapedTeams = async (
  teams: Prisma.ScrapedTeamCreateManyInput[]
) => {
  const ts = await prisma.scrapedTeam.createMany({
    data: teams,
    skipDuplicates: true,
  });

  return ts;
};

export const updateScrapedTeams = async (
  teams: Prisma.ScrapedTeamUpdateInput[]
) => {
  const response = await Promise.all(
    teams.map(async (t) => {
      delete t.players;
      try {
        const ts = await prisma.scrapedTeam.update({
          data: t,
          where: {
            id: t.id as string,
          },
        });
        return ts;
      } catch (err) {
        logger.error(err);
        return err;
      }
    })
  );

  return teams;
};

export const listScrapedTeamsWithPlayersAndLeague = async () => {
  const teams = await prisma.scrapedTeam.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      players: true,
      league: true,
    },
  });
  return teams;
};

export const listScrapedTeams = async () => {
  const teams = await prisma.scrapedTeam.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return teams;
};

export const listScrapedFootballTeamsWithPlayers = async () => {
  const teams = await prisma.scrapedTeam.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      league: {
        abr: "nfl",
      },
    },
    include: {
      players: true,
    },
  });
  return teams;
};
