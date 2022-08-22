import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import {
  createFantasyProsPlayers,
  getFPSPlayersForDraft,
} from './models/fantasaySportsData';
import { getLeagues, listLeagues } from './models/leagues';
import { createPlayers, listNflPlayersWithNoFPSData } from './models/players';
import {
  createTeams,
  listTeams,
  updateTeams,
  listFootballTeams,
} from './models/teams';
import { getPlayers } from './requests/espn/getPlayers';

import { getTeams } from './requests/espn/getTeams';
import { getFantasyProsData } from './requests/fantasyPros/getFantasyFootballRankings';
import { getFantasyProsDataCSV } from './requests/fantasyPros/getFantasyFootballRankingsCSV';
import { FantasyProsData, Prisma, PrismaClient, Team } from '@prisma/client';
import logger from './util/logger';

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
    msg: 'HTTP  ',
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

const mergeValues: (
  v2: {
    id: string;
    number: string;
    name: string;
    pos: string;
    team: Team;
    injuryStatus: string;
    depth: number;
    positionGroup: string;
    playerImageSrc: string;
    height: string;
    weight: string;
    experience: string;
    playerDepthPosition: string[];
  }[],
  v1: (FantasyProsData & {
    player: {
      number: string;
      pos: string;
      team: Team;
      name: string;
      injuryStatus: string;
      depth: number;
      positionGroup: string;
      playerImageSrc: string;
      height: string;
      weight: string;
      experience: string;
      playerDepthPosition: string[];
    };
  })[]
) => NormalizedPlayerResponse[] = (v2, v1) => {
  const normalizedP: NormalizedPlayerResponse[] = [];
  v1.forEach(p => {
    const player = p.player;
    const team = player?.team;

    const playerDepthPosition = p.player?.playerDepthPosition
      ? p.player?.playerDepthPosition.join(', ')
      : undefined;
    delete p.player;
    const teamName = [team?.city, team?.name].filter(v => !!v).join(' ');
    const getRndP = getRoundAndPick(p.avgAdp);
    const nPlayer: NormalizedPlayerResponse = {
      ...player,
      ...p,
      pos: p.pos ?? player.pos,
      teamName: teamName,
      teamAbr: team?.abr,
      teamImgSrc: team?.imgSrc,
      playerDepthPosition,
      drafted: false,
      getRoundAndPick: getRndP,
    };
    normalizedP.push(nPlayer);
  });
  v2.forEach(p => {
    const team = p?.team;
    const sameTeam = normalizedP.find(n => n.teamAbr === team.abr);
    const playerDepthPosition = p.playerDepthPosition
      ? p.playerDepthPosition.join(', ')
      : undefined;
    const teamName = [team?.city, team?.name].filter(v => !!v).join(' ');
    const nPlayer: NormalizedPlayerResponse = {
      ...p,
      playerName: p.name,
      playerId: p.id,
      teamName: teamName,
      teamAbr: team.abr,
      teamImgSrc: team.imgSrc,
      byeWeek: sameTeam.byeWeek,
      playerDepthPosition,
      drafted: false,
    };
    normalizedP.push(nPlayer);
  });
  return normalizedP;
};

export interface NormalizedPlayerResponse {
  id: string;
  playerId: null | string;
  rank?: number;
  playerName: string;
  teamAbr: string;
  pos: string;
  byeWeek: number | null;
  strengthOgSchedule?: string;
  avgAdp?: string;
  notes?: string;
  avgFanPoints?: number;
  avgPassingYds?: number;
  avgPassingTds?: number;
  avgReceivingRec?: number;
  avgReceivingYds?: number;
  avgReceivingTds?: number;
  avgRushingAtt?: number;
  avgRushingYds?: number;
  avgRushingTds?: number;
  totalFanPoints?: number;
  totalPassingYds?: number;
  totalPassingTds?: number;
  totalReceivingRec?: number;
  totalReceivingYds?: number;
  totalReceivingTds?: number;
  totalRushingAtt?: number;
  totalRushingYds?: number;
  totalRushingTds?: number;
  name: string;
  injuryStatus: string | null;
  depth: number | null;
  positionGroup: string | null;
  playerDepthPosition: string;
  playerImageSrc: string;
  height: string | null;
  weight: null | string;
  number: null | string;
  teamName?: string | null;
  teamImgSrc?: string | null;
  experience: string | null;
  drafted: boolean;
  getRoundAndPick?: string;
}

const getRoundAndPick = (adp?: string) => {
  if (adp) {
    const playerRoundSplit = adp.split('.');
    let round = Math.ceil(parseInt(playerRoundSplit[0]) / 12);
    let pick = Math.round(parseFloat(adp) / round);
    if (pick === 0) {
      pick = 12;
    }
    const draftRoundAndPick = `Round ${round} Pick ${pick}`;
    return draftRoundAndPick;
  }
};
