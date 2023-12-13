import { Express } from "express";
import { Logger } from "winston";

import { createFantasyProsPlayers } from "../models/fantasaySportsData";
import { listScrapedFootballTeamsWithPlayers } from "../models/scrapedTeams";
import { getFantasyProsDataCSV } from "../requests/fantasyPros/getFantasyFootballRankingsCSV";

export const csvConversionRoutes = (app: Express, logger: Logger) => {
  app.get("/convertFpsData", async (req, res) => {
    const teams = await listScrapedFootballTeamsWithPlayers();
    getFantasyProsDataCSV(teams)
      .then(async (resp) => {
        try {
          const ps = await createFantasyProsPlayers(resp);

          res.status(200).json({ resp, ps });
        } catch (err) {
          logger.error(err);
          res.status(500).json({ err });
        }
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  });
};
