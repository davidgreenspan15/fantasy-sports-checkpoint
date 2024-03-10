import { Express } from "express";
import { Logger } from "winston";

import {
  getDraftBoard,
  getLeaguesWithTeams,
  resetData,
  todaysBirthday,
} from "../handlers/common";
import { prisma } from "..";
import { listTeamAthletes } from "../models/athletes";
import { listParentPositions } from "../models/positions";
import { getGameById, listTeamGames } from "../models/games";
import { getGameStatistic } from "../models/GameStatistics";
import { migrateGameStatistics } from "../handlers/espnApiV2";
import { listTeamRoster } from "../models/rosters";
import { omit } from "lodash";
import { Position as PrismaPosition } from "@prisma/client";
export interface TodaysBirthdayPlayer {
  fullName: string;
  dateOfBirth: Date;
  birthday: string;
  espnUrl: string;
  Position: Position;
  Team: Team;
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

      if (shouldMigrateGame) {
        await migrateGameStatistics([gameId], undefined, undefined);
      }
      const { gameStatistics, game } = await getGameStatistic(gameId);

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
        const athletesStatistics =
          gameStatistics?.AthleteGameStatistics?.reduce((acc, a) => {
            if (a.Athlete.teamId !== t.id) {
              return acc;
            }
            Object.keys(a).forEach((key) => {
              if (key != "athleteId" && key != "Athlete") {
                const v = a[key];
                if (v && typeof v === "object") {
                  Object.keys(v).forEach((k) => {
                    if (v[k] !== null) {
                      const stats = omit(v[k], [
                        "teamId",
                        "athleteId",
                        "gameId",
                        "id",
                      ]);
                      if (!acc[k]) {
                        const athleteStats = {
                          athleteId: a.athleteId,
                          displayName: a.Athlete.displayName,
                          imageUrl: a.Athlete.imageUrl,
                          position: a.Athlete.Position.abbreviation,
                          ...stats,
                        };
                        acc[k] = [athleteStats];
                      } else {
                        const athleteStats = {
                          athleteId: a.athleteId,
                          displayName: a.Athlete.displayName,
                          imageUrl: a.Athlete.imageUrl,
                          position: a.Athlete.Position.abbreviation,
                          ...stats,
                        };
                        acc[k].push(athleteStats);
                      }
                    }
                  });
                }
              }
            });
            return acc;
          }, {});
        team["athletesStatistics"] = athletesStatistics;
        mappedGameStatistics.teams.push(team);
      });

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
      const playersWithBirthdays = playersWithBrithdays.reduce((acc, p) => {
        p.playerWithBirthdays.forEach((pwb) => {
          if (!acc[pwb.espnUrl]) {
            acc[pwb.espnUrl] = pwb;
          }
        });
        return acc;
      }, {} as Record<string, TodaysBirthdayPlayer>);

      const successFullPlayers = Object.values(playersWithBirthdays).filter(
        (p) => {
          return (
            p.AthleteGameStatistic?.[0]?.NflStatistic?.PassingStatistic
              .touchdowns > 0 ||
            p.AthleteGameStatistic?.[0]?.NflStatistic?.RushingStatistic
              .touchdowns > 0 ||
            p.AthleteGameStatistic?.[0]?.NflStatistic?.ReceivingStatistic
              .touchdowns > 0
          );
        }
      );
      const unsuccessfulPlayers = Object.values(playersWithBirthdays).filter(
        (p) => {
          return (
            p.AthleteGameStatistic?.[0]?.NflStatistic?.PassingStatistic
              .touchdowns === 0 &&
            p.AthleteGameStatistic?.[0]?.NflStatistic?.RushingStatistic
              .touchdowns === 0 &&
            p.AthleteGameStatistic?.[0]?.NflStatistic?.ReceivingStatistic
              .touchdowns === 0
          );
        }
      );
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
