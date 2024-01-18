import { Express } from "express";
import { Logger } from "winston";

import {
  // dropEspnData,
  migrateDepths,
  migrateFreeAgentAthletes,
  migrateTeamAthletes,
  migrateGames,
  migrateTeams,
  migrateGameStatistics,
} from "../handlers/espnApiV2";
import {
  connectSeasonsToGames,
  reconnectAthletesGamesTeamsToLeagues,
} from "../util/migrationFixes";
import { getGameStatistic } from "../models/GameStatistics";

export const espnApiV2Routes = (app: Express, logger: Logger) => {
  //Run Full Migration
  app.get("/migrateAll", async (req, res) => {
    try {
      logger.debug("Started Migration");
      const savedTeams = await migrateTeams();
      logger.debug("Saved Teams");
      const teamGames = await migrateGames();
      logger.debug("Saved Team Games");
      const teamAthletes = await migrateTeamAthletes();
      logger.debug("Saved Team Athletes");
      const freeAgentAthletes = await migrateFreeAgentAthletes();
      logger.debug("Saved Free Agent Athletes");
      const depths = await migrateDepths(logger);
      logger.debug("Saved Depths");
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
  app.get("/migrateGames", async (req, res) => {
    try {
      const teamGames = await migrateGames();
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

  app.get("/migrateGameStatistics", async (req, res) => {
    try {
      const gameIds = req.body.gameIds ?? [];
      const gameStatistics = await migrateGameStatistics(
        logger,
        gameIds,
        true,
        false
      );
      res.status(200).json({ gameStatistics });
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
  // app.get("/reconnectAthletesGamesTeamsToLeagues", async (req, res) => {
  //   try {
  //     const resp = await reconnectAthletesGamesTeamsToLeagues();
  //     res.status(200).json({ resp });
  //   } catch (err) {
  //     logger.error(err);
  //     res.status(500).json(err);
  //   }
  // });
  app.get("/connectSeasonsToGames", async (req, res) => {
    try {
      const resp = await connectSeasonsToGames();
      res.status(200).json({ resp });
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
  app.get("/showGameStatistics", async (req, res) => {
    try {
      const resp = await getGameStatistic(
        "f3fd289d-7302-45b0-bdc5-030c529b9750"
      );
      res.status(200).json({ resp });
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
  // app.get("/dropEspnData", async (req, res) => {
  //   try {
  //     const drop = await dropEspnData();
  //     res.status(200).json({ drop });
  //   } catch (err) {
  //     logger.error(err);
  //     res.status(500).json(err);
  //   }
  // });
};
