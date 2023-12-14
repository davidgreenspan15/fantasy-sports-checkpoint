import { Express } from "express";
import { Logger } from "winston";

import {
  scrapeBirthdays,
  scrapeGames,
  scrapePlayers,
  scrapeTeams,
} from "../handlers/scraping";

export const scrapingRoutes = (app: Express, logger: Logger) => {
  app.get("/scrapeTeams", async (req, res) => {
    try {
      const scrapedTeams = scrapeTeams();
      res.status(200).json(scrapedTeams);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
  app.get("/scrapePlayers", async (req, res) => {
    try {
      const { count, players } = await scrapePlayers();
      res.status(200).json({ count, players });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  app.get("/scrapeGames", async (req, res) => {
    try {
      const { count, teamGames } = await scrapeGames();
      res.status(200).json({ count, teamGames });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  app.get("/scrapeBirthdays", async (req, res) => {
    try {
      const playersWithBirthdays = await scrapeBirthdays();
      res.status(200).json({ playersWithBirthdays });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
};
