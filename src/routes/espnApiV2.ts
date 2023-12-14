import { Express } from "express";
import { Logger } from "winston";

import { migratePlayers, migrateTeams } from "../handlers/espnApiV2";

export const espnApiV2Routes = (app: Express, logger: Logger) => {
  app.get("/migrateTeams", async (req, res) => {
    try {
      const savedTeams = await migrateTeams();
      res.status(200).json({ count: savedTeams.length, savedTeams });
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });

  app.get("/migratePlayers", async (req, res) => {
    try {
      const savedPlayers = await migratePlayers();
      res.status(200).json({ count: savedPlayers.length, savedPlayers });
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
};
