import { Express } from "express";
import { Logger } from "winston";

import { getDraftBoard, resetData, todaysBirthday } from "../handlers/common";
import { prisma } from "..";
import { getAthletesById, listTeamAthletes } from "../models/athletes";
import { listParentPositions } from "../models/positions";
import { listLeaguesWithTeams } from "../models/leagues";
import { getGameById, listTeamGames } from "../models/games";
import { getGameStatistic } from "../models/GameStatistics";
import { migrateGameStatistics } from "../handlers/espnApiV2";
import { listTeamRoster } from "../models/rosters";

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

  app.post("/getGame", async (req, res) => {
    try {
      const gameId = req.body.gameId;
      const games = await getGameById(gameId);
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

      if (shouldMigrateGame) {
        await migrateGameStatistics([gameId], undefined, undefined);
      }
      const parentPositions = await listParentPositions();
      const { gameStatistics, game } = await getGameStatistic(gameId);
      const athletes = await getAthletesById(
        gameStatistics?.AthleteGameStatistics.map((ags) => ags.athleteId) ?? []
      );

      const mappedGameStatistics = {
        timeOnClock: game.timeOnClock,
        period: game.period,
        teams: [],
        isComplete: game.isComplete,
      };
      game.Teams.forEach((t) => {
        const team = {
          ...t,
          timeOnClock: game.timeOnClock,
          period: game.period,
          isHome: t.id === game.homeTeamId,
          TeamStatistics: gameStatistics?.TeamGameStatistics.find((tgs) => {
            return tgs.teamId === t.id;
          }),
        };
        athletes.forEach((a) => {
          const athlete = {
            ...a,
            positionDisplayName: a.Position.displayName,
            parentPositionDisplayName: parentPositions.find(
              (p) => p.espnId === a.Position.parentPositionId
            )?.displayName,
            AthleteStatistics: gameStatistics?.AthleteGameStatistics?.find(
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
        mappedGameStatistics.teams.push(team);
      });

      res.status(200).json(mappedGameStatistics);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });

  app.post("/getRoster", async (req, res) => {
    try {
      const teamId = req.body.teamId;
      const displayYear = req.body.displayYear;
      const seasonType = req.body.seasonType;
      const parentPositions = await listParentPositions();
      const roster = await listTeamRoster(displayYear, seasonType, teamId);
      const athletes = roster?.Athletes.map((a) => {
        return {
          ...a,
          positionDisplayName: a.Position.displayName,
          parentPositionDisplayName: parentPositions.find(
            (p) => p.espnId === a.Position.parentPositionId
          )?.displayName,
          Position: undefined,
        };
      });
      res.status(200).json(athletes);
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

  app.get("/birthdayStats", async (req, res) => {
    try {
      const games = await prisma.game.findMany({
        where: { League: { abbreviation: "NFL" } },
      });
      const playersWithBrithdays = await Promise.all(
        games.map(async (game) => {
          return await todaysBirthday(game.date);
        })
      );
      const playersWithBirthdays = playersWithBrithdays.flatMap(
        (p) => p.playerWithBirthdays
      );

      const successFullPlayers = playersWithBirthdays.filter((p) => {
        return (
          p.AthleteGameStatistic?.[0]?.NflStatistic?.PassingStatistics
            .touchdowns > 0 ||
          p.AthleteGameStatistic?.[0]?.NflStatistic?.RushingStatistics
            .touchdowns > 0 ||
          p.AthleteGameStatistic?.[0]?.NflStatistic?.ReceivingStatistics
            .touchdowns > 0
        );
      });
      const unsuccessfulPlayers = playersWithBirthdays.filter((p) => {
        return (
          p.AthleteGameStatistic?.[0]?.NflStatistic?.PassingStatistics
            .touchdowns === 0 &&
          p.AthleteGameStatistic?.[0]?.NflStatistic?.RushingStatistics
            .touchdowns === 0 &&
          p.AthleteGameStatistic?.[0]?.NflStatistic?.ReceivingStatistics
            .touchdowns === 0
        );
      });
      res.status(200).json({
        successFullPlayersCount: successFullPlayers.length,
        unsuccessfulPlayersCount: unsuccessfulPlayers.length,
        successFullPlayers,
        unsuccessfulPlayers,
      });
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
