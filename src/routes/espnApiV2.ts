import { Express } from "express";
import { Logger } from "winston";

import {
  migrateDepths,
  migrateFreeAgentAthletes,
  migrateTeamAthletes,
  migrateTeamGames,
  migrateTeams,
} from "../handlers/espnApiV2";

export const espnApiV2Routes = (app: Express, logger: Logger) => {
  //Run Full Migration
  app.get("/migrateAll", async (req, res) => {
    try {
      console.log("Started Migration");
      const savedTeams = await migrateTeams();
      console.log("Saved Teams");
      const teamGames = await migrateTeamGames();
      console.log("Saved Team Games");
      const teamAthletes = await migrateTeamAthletes();
      console.log("Saved Team Athletes");
      const freeAgentAthletes = await migrateFreeAgentAthletes();
      console.log("Saved Free Agent Athletes");
      const depths = await migrateDepths(logger);
      console.log("Saved Depths");
      res.status(200).json({
        savedTeams,
        teamGames,
        teamAthletes,
        freeAgentAthletes,
        depths,
      });
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });

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
      const teamGames = await migrateTeamGames();
      res.status(200).json(teamGames);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
  // Migrates All Team Athletes, Positions
  app.get("/migrateTeamAthletes", async (req, res) => {
    try {
      const teamAthletes = await migrateTeamAthletes();
      res.status(200).json(teamAthletes);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
  // Migrates All FreeAgent Athletes, Positions
  app.get("/migrateFreeAgentAthletes", async (req, res) => {
    try {
      const freeAgentAthletes = await migrateFreeAgentAthletes();
      res.status(200).json(freeAgentAthletes);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
  // Migrate Depths
  app.get("/migrateDepths", async (req, res) => {
    try {
      const depths = await migrateDepths(logger);
      res.status(200).json({ depths });
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
};
