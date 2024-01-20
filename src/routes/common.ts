import { Express } from "express";
import { Logger } from "winston";

import { getDraftBoard, resetData, todaysBirthday } from "../handlers/common";
import { prisma } from "..";
import { listTeamAthletes } from "../models/athletes";
import { listParentPositions } from "../models/positions";
import { listLeaguesWithTeams } from "../models/leagues";
import { listTeamGames } from "../models/games";
import { getGameStatistic } from "../models/GameStatistics";
import { migrateGameStatistics } from "../handlers/espnApiV2";

export const commonRoutes = (app: Express, logger: Logger) => {
  app.get("/resetData", async (req, res) => {
    try {
      await resetData();
      res.status(200).json({ message: "Data Reset" });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
  app.get("/getLeaguesWithTeams", async (req, res) => {
    try {
      const resp = await listLeaguesWithTeams();
      res.status(200).json(resp);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });
  app.post("/getAthlete", async (req, res) => {
    try {
      const teamId = req.body.teamId;
      const teamAthletes = await listTeamAthletes(teamId);
      const parentPositions = await listParentPositions();
      const resp = teamAthletes.map((ta) => {
        const athlete = {
          ...ta,
          positionDisplayName: ta.Position.displayName,
          parentPositionDisplayName: parentPositions.find(
            (p) => p.espnId === ta.Position.parentPositionId
          )?.displayName,
          Position: undefined,
        };

        return athlete;
      });

      res.status(200).json(resp);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });

  app.post("/getGames", async (req, res) => {
    try {
      const teamId = req.body.teamId;
      const displayYear = req.body.displayYear;
      const seasonType = req.body.seasonType;
      const games = await listTeamGames(displayYear, seasonType, teamId);
      res.status(200).json(games);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });

  app.post("/getGameStatistics", async (req, res) => {
    try {
      const gameId = req.body.gameId;
      const shouldMigrateGame = req.body.shouldMigrateGame;
      const parentPositions = await listParentPositions();

      if (shouldMigrateGame) {
        await migrateGameStatistics([gameId], undefined, false);
      }
      const { gameStatistics, rosters } = await getGameStatistic(gameId);
      const mappedGameStatistics = [];
      rosters.forEach((r) => {
        const team = {
          id: r.Team.id,
          displayName: r.Team.displayName,
          TeamStatistics: gameStatistics.TeamGameStatistics.find((tgs) => {
            return tgs.teamId === r.Team.id;
          }),
        };

        r.Athletes.forEach((a) => {
          const athlete = {
            id: a.id,
            displayName: a.displayName,
            imageUrl: a.imageUrl,
            number: a.number,
            positionDisplayName: a.Position.displayName,
            parentPositionDisplayName: parentPositions.find(
              (p) => p.espnId === a.Position.parentPositionId
            )?.displayName,
            AthleteStatistics: gameStatistics.AthleteGameStatistics.find(
              (ags) => {
                return ags.athleteId === a.id;
              }
            ),
          };
          if (!team["Athletes"]) {
            team["Athletes"] = [];
          }
          team["Athletes"].push(athlete);
        });
        mappedGameStatistics.push(team);
      });

      res.status(200).json(mappedGameStatistics);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });

  app.get("/todaysBirthday", async (req, res) => {
    try {
      const playersWithBirthdayAndGame = await todaysBirthday();
      res.status(200).json(playersWithBirthdayAndGame);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  app.get("/getDraftBoard", async (req, res) => {
    try {
      const players = await getDraftBoard();
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
