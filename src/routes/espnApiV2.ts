import { Express } from "express";
import { Logger } from "winston";

import {
  migrateTeamAthletes,
  migrateTeamGames,
  migrateTeams,
} from "../handlers/espnApiV2";

export const espnApiV2Routes = (app: Express, logger: Logger) => {
  //Migrates All Teams
  app.get("/migrateTeams", async (req, res) => {
    try {
      const savedTeams = await migrateTeams();
      res.status(200).json({ count: savedTeams.length, savedTeams });
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
  // Migrates All Team Games and Games
  app.get("/migrateTeamGames", async (req, res) => {
    try {
      const resp = await migrateTeamGames();
      res.status(200).json(resp);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
  // Migrates All Team Athletes, Positions, PositionGroups
  app.get("/migrateTeamAthletes", async (req, res) => {
    try {
      const teamAthletes = await migrateTeamAthletes();
      res.status(200).json(teamAthletes);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
};
