import express from "express";
import expressWinston from "express-winston";
import winston from "winston";

import { commonRoutes } from "./routes/common";
import { csvConversionRoutes } from "./routes/csvConversion";
import { scrapingRoutes } from "./routes/scraping";
import logger from "./util/logger";
import { espnApiV2Routes } from "./routes/espnApiV2";

const app = express();

const PORT = process.env.PORT || 8000;
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type"
  );
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
    msg: "HTTP ",
    expressFormat: true,
    statusLevels: true,
    colorize: false,
    ignoreRoute: function (req, res) {
      return false;
    },
  })
);
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

commonRoutes(app, logger);
scrapingRoutes(app, logger);
csvConversionRoutes(app, logger);
espnApiV2Routes(app, logger);

app.listen(PORT, () => {
  logger.debug(`app listening at http://localhost:${PORT}`);
});

export interface Workflow {
  getTeamsList: boolean;
  getPlayersRoster: boolean;
  getPlayersDepthChart: boolean;
  get: boolean;
  updatingTeamsDB: boolean;
  updatingPlayersDB: boolean;
}
