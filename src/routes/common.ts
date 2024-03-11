import { Position as PrismaPosition } from "@prisma/client";
import { Express } from "express";
import { Logger } from "winston";

import { prisma } from "..";
import {
  getDraftBoard,
  getGameStatistics,
  getLeaguesWithTeams,
  resetData,
  getSeasonBirthdayStats,
  todaysBirthday,
} from "../handlers/common";
import { listTeamAthletes } from "../models/athletes";
import { getGameById, listTeamGames } from "../models/games";
import { listParentPositions } from "../models/positions";
import { listTeamRoster } from "../models/rosters";

export interface TodaysBirthdayPlayer {
  fullName: string;
  dateOfBirth: Date;
  birthday: string;
  espnUrl: string;
  Position: Position;
  AwayTeam: Team;
  HomeTeam: Team;
  AthleteGameStatistic: AthleteGameStatistic[];
}

export interface AthleteGameStatistic {
  NflStatistic: NflStatistic;
}

export interface NflStatistic {
  PassingStatistic: PassingStatistics;
  RushingStatistic: RushingStatistics;
  ReceivingStatistic: ReceivingStatistics;
}

export interface PassingStatistics {
  id: string;
  completions: number;
  attempts: number;
  yards: number;
  yardsPerAttempt: number;
  touchdowns: number;
  interceptions: number;
  sacks: number;
  sackYardsLost: number;
  adjustedRating: number;
  rating: number;
  teamId?: string;
  athleteId: string;
  gameId: string;
}

export interface ReceivingStatistics {
  id: string;
  receptions: number;
  targets: number;
  yards: number;
  yardsPerReception: number;
  touchdowns: number;
  longest: number;
  teamId?: string;
  athleteId: string;
  gameId: string;
}

export interface RushingStatistics {
  id: string;
  attempts: number;
  yards: number;
  yardsPerAttempt: number;
  touchdowns: number;
  longest: number;
  teamId?: string;
  athleteId: string;
  gameId: string;
}

export interface Position {
  name: string;
  abbreviation: string;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  League: League;
  Games: Game[];
}

export interface Game {
  date: Date;
  name: string;
  week: number;
  "Formatted Dated"?: string;
}

export interface League {
  abbreviation: string;
}
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
      const resp = await getLeaguesWithTeams();
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
            (p) => p.espnId === ta.Position.parentId
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
      let games = await listTeamGames(displayYear, seasonType, teamId);

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

      const mappedGameStatistics = await getGameStatistics(
        gameId,
        shouldMigrateGame
      );
      console.log(mappedGameStatistics);
      res.status(200).json(mappedGameStatistics);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });

  type PositionsWithNestedParent = PrismaPosition & { Parent?: PrismaPosition };
  app.post("/getRoster", async (req, res) => {
    try {
      const teamId = req.body.teamId;
      const displayYear = req.body.displayYear;
      const seasonType = req.body.seasonType;
      const roster = await listTeamRoster(displayYear, seasonType, teamId);
      const athletes = roster?.Athletes.filter((a) => !!a.Position).map((a) => {
        const findParentPosition = (position: PositionsWithNestedParent) => {
          if (position.Parent) {
            return position.Parent;
          }
        };

        const findRootParentPosition = (
          position: PositionsWithNestedParent
        ) => {
          if (position.Parent) {
            return findRootParentPosition(position.Parent);
          }
          return position;
        };
        return {
          ...a,
          positionDisplayName: a.Position?.displayName,
          rootParentPositionDisplayName: findRootParentPosition(a.Position)
            ?.displayName,
          parentPositionDisplayName: findParentPosition(a.Position)
            ?.displayName,
          Position: undefined,
        };
      });
      res.status(200).json(athletes);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  });

  app.get("/getTodaysBirthdays", async (req, res) => {
    try {
      //@ts-ignore
      const date = req.query.date as Date;
      const playersWithBirthdayAndGame = await todaysBirthday(date);
      res.status(200).json(playersWithBirthdayAndGame);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  app.get("/getSeasonBirthdayStats", async (req, res) => {
    try {
      const seasonBirthdayStats = await getSeasonBirthdayStats();
      res.status(200).json(seasonBirthdayStats);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  // app.get("/getFootballBirthdayStats", async (req, res) => {
  //   try {
  //     const playersWithBirthdayAndGame = await todaysBirthday(date);
  //     res.status(200).json(playersWithBirthdayAndGame);
  //   } catch (err) {
  //     logger.error(err);
  //     res.status(500).json({ err });
  //   }
  // });

  // app.get("/birthdayStats", async (req, res) => {
  //   try {
  //     const games = await prisma.game.findMany({
  //       where: { League: { abbreviation: "NFL" } },
  //     });
  //     const playersWithBrithdays = await Promise.all(
  //       games.map(async (game) => {
  //         return await todaysBirthday(game.date);
  //       })
  //     );
  //     const playersWithBirthdays = playersWithBrithdays.reduce((acc, p) => {
  //       p.forEach((pwb) => {
  //         if (!acc[pwb.espnUrl]) {
  //           acc[pwb.espnUrl] = pwb;
  //         }
  //       });
  //       return acc;
  //     }, {} as Record<string, TodaysBirthdayPlayer>);

  //     const successFullPlayers = Object.values(playersWithBirthdays).filter(
  //       (p) => {
  //         return (
  //           p.AthleteGameStatistic?.[0]?.NflStatistic?.PassingStatistic
  //             .touchdowns > 0 ||
  //           p.AthleteGameStatistic?.[0]?.NflStatistic?.RushingStatistic
  //             .touchdowns > 0 ||
  //           p.AthleteGameStatistic?.[0]?.NflStatistic?.ReceivingStatistic
  //             .touchdowns > 0
  //         );
  //       }
  //     );
  //     const unsuccessfulPlayers = Object.values(playersWithBirthdays).filter(
  //       (p) => {
  //         return (
  //           p.AthleteGameStatistic?.[0]?.NflStatistic?.PassingStatistic
  //             .touchdowns === 0 &&
  //           p.AthleteGameStatistic?.[0]?.NflStatistic?.RushingStatistic
  //             .touchdowns === 0 &&
  //           p.AthleteGameStatistic?.[0]?.NflStatistic?.ReceivingStatistic
  //             .touchdowns === 0
  //         );
  //       }
  //     );
  //     res.status(200).json({
  //       successFullPlayersCount: successFullPlayers.length,
  //       unsuccessfulPlayersCount: unsuccessfulPlayers.length,
  //       successFullPlayers,
  //       unsuccessfulPlayers,
  //     });
  //   } catch (err) {
  //     logger.error(err);
  //     res.status(500).json({ err });
  //   }
  // });

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
