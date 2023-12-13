import { Express } from "express";
import { Logger } from "winston";

import { createScrapedGames } from "../models/scrapedGames";
import { getScrapedLeagues } from "../models/scrapedLeagues";
import {
  createScrapedPlayers,
  listScrapedLeaguesPlayers,
  updateScrapedPlayers,
} from "../models/scrapedPlayers";
import {
  createScrapedTeams,
  listScrapedTeams,
  listScrapedTeamsWithPlayersAndLeague,
} from "../models/scrapedTeams";
import { scrapeGames } from "../requests/espn/scrapeGames";
import { scrapePlayers } from "../requests/espn/scrapePlayers";
import { scrapeTeams } from "../requests/espn/scrapeTeams";
import { scrapeMorePlayerInfoForAllPlayers } from "../requests/espn/scrapeMorePlayerInfo";

export const scrapingRoutes = (app: Express, logger: Logger) => {
  app.get("/scrapeTeams", async (req, res) => {
    const leagues = await getScrapedLeagues();
    scrapeTeams(leagues)
      .then(async (resp) => {
        try {
          const teams = await createScrapedTeams(resp);
          res.status(200).json({ resp, teams });
        } catch (err) {
          logger.error(err);
          res.status(500).json({ err });
        }
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  });
  app.get("/scrapePlayers", async (req, res) => {
    const teams = await listScrapedTeamsWithPlayersAndLeague();
    scrapePlayers(teams)
      .then(async (resp) => {
        const { teams, players } = resp;
        try {
          const ps = await createScrapedPlayers(players);
          res.status(200).json({ ps });
        } catch (err) {
          logger.error(err);
          res.status(500).json({ err });
        }
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  });
  app.get("/scrapeGames", async (req, res) => {
    const teams = await listScrapedTeams();

    scrapeGames(teams)
      .then(async (resp) => {
        const {} = resp;
        try {
          const games = await createScrapedGames(resp);
          res.status(200).json({ resp, games });
        } catch (err) {
          logger.error(err);
          res.status(500).json({ err });
        }
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  });

  app.get("/scrapeBirthdays", async (req, res) => {
    const players = await listScrapedLeaguesPlayers(["nfl"]);
    scrapeMorePlayerInfoForAllPlayers(players.slice(0, 100))
      .then(async (resp) => {
        try {
          const player = await updateScrapedPlayers(resp);
          res.status(200).json({ player, resp });
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
