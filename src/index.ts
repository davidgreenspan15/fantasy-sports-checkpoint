import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';

import { getTeams } from './requests/espn/getTeams';
import { leaguesInfo } from './util/leagueinfo';

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
      winston.format.json()
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

app.get('/getDepthChart', (req, res) => {
  const workflow: Workflow = {
    getTeamsList: false,
    getPlayersRoster: false,
    getPlayersDepthChart: false,
    get: false,
    updatingTeamsDB: false,
    updatingPlayersDB: false,
  };
  getTeams({ workflow, leagues: leaguesInfo })
    .then(async resp => {
      res.status(200).json({ resp });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
});

app.get('/getPlayers', (req, res) => {});

export interface Workflow {
  getTeamsList: boolean;
  getPlayersRoster: boolean;
  getPlayersDepthChart: boolean;
  get: boolean;
  updatingTeamsDB: boolean;
  updatingPlayersDB: boolean;
}
