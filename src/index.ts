import { PrismaClient } from '@prisma/client';
import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';

import {
  createFantasyProsPlayers,
  getFPSPlayersForDraft,
} from './models/fantasaySportsData';
import { getLeagues, listLeagues } from './models/leagues';
import { createPlayers, listNflPlayersWithNoFPSData } from './models/players';
import { createTeams, listFootballTeams, listTeams } from './models/teams';
import { getPlayers } from './requests/espn/getPlayers';
import { getTeams } from './requests/espn/getTeams';
import { getFantasyProsDataCSV } from './requests/fantasyPros/getFantasyFootballRankingsCSV';
import logger from './util/logger';
import { mergeValues } from './util/normalizePlayers';

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 8000;
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,Content-Type'
  );

  // res.setHeader('Access-Control-Allow-Credentials', 'false');

  next();
});
app.use(express.json());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
      winston.format.cli()
    ),
    meta: false,
    msg: 'HTTP ',
    expressFormat: true,
    statusLevels: true,
    colorize: false,
    ignoreRoute: function (req, res) {
      return false;
    },
  })
);
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// SEARCH REQUEST

app.get('/setTeams', async (req, res) => {
  const leagues = await getLeagues();
  getTeams(leagues)
    .then(async resp => {
      try {
        const teams = await createTeams(resp);
        res.status(200).json({ resp, teams });
      } catch (err) {
        logger.error(err);
        res.status(500).json({ err });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

app.get('/setPlayers', async (req, res) => {
  const teams = await listTeams();
  getPlayers(teams)
    .then(async resp => {
      const { teams, players } = resp;
      try {
        const ps = await createPlayers(players);

        res.status(200).json({ ps });
      } catch (err) {
        logger.error(err);
        res.status(500).json({ err });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

app.get('/setFpsData', async (req, res) => {
  const teams = await listFootballTeams();
  getFantasyProsDataCSV(teams)
    .then(async resp => {
      try {
        const ps = await createFantasyProsPlayers(resp);

        res.status(200).json({ resp, ps });
      } catch (err) {
        logger.error(err);
        res.status(500).json({ err });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

app.listen(PORT, () => {
  logger.debug(`app listening at http://localhost:${PORT}`);
});

app.get('/getPlayers', async (req, res) => {
  try {
    const leagues = await listLeagues();
    res.status(200).json({ leagues });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err });
  }
});

app.get('/getDraftBoard', async (req, res) => {
  try {
    const fpsPlayers = await getFPSPlayersForDraft();
    const playersWithNoFps = await listNflPlayersWithNoFPSData();
    const players = mergeValues(playersWithNoFps, fpsPlayers);
    res.status(200).json({ players });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err });
  }
});

app.post('/query', async (req, res) => {
  const query = req.body.query;

  try {
    const result = await prisma.$queryRawUnsafe(query);

    res.status(200).json(result);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err });
  }
});

export interface Workflow {
  getTeamsList: boolean;
  getPlayersRoster: boolean;
  getPlayersDepthChart: boolean;
  get: boolean;
  updatingTeamsDB: boolean;
  updatingPlayersDB: boolean;
}
