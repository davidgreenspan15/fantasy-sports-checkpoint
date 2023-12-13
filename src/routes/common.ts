import { Logger } from "winston";
import { Express } from "express";
import { PrismaClient } from "@prisma/client";
import { listScrapedLeagues } from "../models/scrapedLeagues";
import { getFPSPlayersForDraft } from "../models/fantasaySportsData";
import { listNflScrapedPlayersWithNoFPSData } from "../models/scrapedPlayers";
import { mergeValues } from "../util/normalizePlayers";
const prisma = new PrismaClient();

export const commonRoutes = (app: Express, logger: Logger) => {
  app.get("/resetData", async (req, res) => {
    try {
      await prisma.fantasyProsData.deleteMany({});
      await prisma.scrapedPlayer.deleteMany({});
      await prisma.scrapedTeam.deleteMany({});
      await prisma.scrapedGame.deleteMany({});
      res.status(200).json({ messgae: "Data Reset" });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
  app.get("/getPlayers", async (req, res) => {
    try {
      const leagues = await listScrapedLeagues();
      res.status(200).json({ leagues });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  app.get("/todaysBday", async (req, res) => {
    const now = Date.now();
    const twentyFourHoursFrom = +12 * 60 * 60 * 1000;
    try {
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

      const playersWithBirthdayAndGame = players.reduce((ps, player) => {
        const gameToday = games.find(
          (game) => game.homeTeamId === player.teamId
        );
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

      res.status(200).json({ playersWithBirthdayAndGame });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  app.get("/getDraftBoard", async (req, res) => {
    try {
      const fpsPlayers = await getFPSPlayersForDraft();
      const playersWithNoFps = await listNflScrapedPlayersWithNoFPSData();
      const players = mergeValues(playersWithNoFps, fpsPlayers);
      res.status(200).json({ players });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  app.post("/query", async (req, res) => {
    const query = req.body.query;

    try {
      const result = await prisma.$queryRawUnsafe(query);

      res.status(200).json(result);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
};
