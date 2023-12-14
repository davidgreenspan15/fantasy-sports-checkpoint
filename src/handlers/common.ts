import { Logger } from "winston";
import { Express } from "express";
import { PrismaClient } from "@prisma/client";
import { listScrapedLeagues } from "../models/scrapedLeagues";
import { getFPSPlayersForDraft } from "../models/fantasaySportsData";
import { listNflScrapedPlayersWithNoFPSData } from "../models/scrapedPlayers";
import { mergeValues } from "../util/normalizePlayers";

const prisma = new PrismaClient();

export const resetData = async () => {
  await prisma.fantasyProsData.deleteMany({});
  await prisma.scrapedPlayer.deleteMany({});
  await prisma.scrapedGame.deleteMany({});
  await prisma.scrapedTeam.deleteMany({});
};

export const todaysBirthday = async () => {
  const now = Date.now();
  const twentyFourHoursFrom = +12 * 60 * 60 * 1000;

  const d = new Date();
  const teams = await prisma.scrapedTeam.findMany({
    select: {
      id: true,
      abr: true,
    },
  });
  const players = await prisma.scrapedPlayer.findMany({
    where: {
      birthDate: { startsWith: `${d.getMonth() + 1}/${d.getDate()}/` },
    },
    select: {
      name: true,
      teamId: true,
      birthDate: true,
      pos: true,
      positionGroup: true,
      playerDepthPosition: true,
      playerUrl: true,
      team: {
        select: { league: { select: { abr: true } } },
      },
    },
  });

  const games = await prisma.scrapedGame.findMany({
    where: {
      AND: [
        {
          date: {
            gte: new Date(now - twentyFourHoursFrom),
          },
        },
        {
          date: {
            lt: new Date(now + twentyFourHoursFrom), // 24 hours later for less than comparison
          },
        },
      ],
    },
    select: {
      homeTeamId: true,
      awayTeamId: true,
      date: true,
    },
  });

  return players.reduce((ps, player) => {
    const gameToday = games.find((game) => game.homeTeamId === player.teamId);
    if (gameToday) {
      const name = player.name;
      const p = {};
      p[name] = {
        player,
        game: {
          homeTeam: teams.find((t) => t.id === gameToday.homeTeamId),
          awayTeam: teams.find((t) => t.id === gameToday.awayTeamId),
          date: gameToday.date,
        },
      };
      ps.push(p);
    }
    return ps;
  }, []);
};
export const getDraftBoard = async () => {
  const fpsPlayers = await getFPSPlayersForDraft();
  const playersWithNoFps = await listNflScrapedPlayersWithNoFPSData();
  return mergeValues(playersWithNoFps, fpsPlayers);
};
