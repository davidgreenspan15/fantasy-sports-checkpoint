import { AllPlayers, PlayerData } from "../../types/Players";
import jsdom from "jsdom";
import axios from "axios";
import { ScrapedTeam, ScrapedPlayer, FantasyProsData } from "@prisma/client";
import { Domain } from "domain";
import * as fs from "fs";
import * as path from "path";
import * as csv from "fast-csv";
import logger from "../../util/logger";

export const csvConverter = {
  getFantasyProsDataCSV: async (
    teams: (ScrapedTeam & {
      players: ScrapedPlayer[];
    })[]
  ) => {
    const p: FantasyProsData[] = await new Promise((resolve, reject) => {
      const fpsData = [];

      fs.createReadStream(
        path.resolve("src", "csvs", "fps", "fps_overview.csv")
      )
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => logger.error(error))
        .on("data", (row) => {
          const player = getOverView(row, teams);
          if (player) {
            fpsData.push(player);
          }
        })
        .on("end", (rowCount: number) => {
          resolve(fpsData);
        });
    });
    await new Promise((resolve, reject) => {
      const fpsData = [];
      fs.createReadStream(path.resolve("src", "csvs", "fps", "fps_ranks.csv"))
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => logger.error(error))
        .on("data", (row) => {
          const player = getRanks(row, p);
          if (player) {
            fpsData.push(player);
          }
        })
        .on("end", (rowCount: number) => {
          resolve(p);
        });
    });
    await new Promise((resolve, reject) => {
      const fpsData = [];
      fs.createReadStream(path.resolve("src", "csvs", "fps", "fps_notes.csv"))
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => logger.error(error))
        .on("data", (row) => {
          const player = getNotes(row, p);
          if (player) {
            fpsData.push(player);
          }
        })
        .on("end", (rowCount: number) => {
          resolve(p);
        });
    });
    await new Promise((resolve, reject) => {
      const fpsData = [];
      fs.createReadStream(
        path.resolve("src", "csvs", "fps", "fps_total_stats.csv")
      )
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => logger.error(error))
        .on("data", (row) => {
          const player = geTotalStats(row, p);
          if (player) {
            fpsData.push(player);
          }
        })
        .on("end", (rowCount: number) => {
          resolve(p);
        });
    });
    await new Promise((resolve, reject) => {
      const fpsData = [];
      fs.createReadStream(
        path.resolve("src", "csvs", "fps", "fps_average_stats.csv")
      )
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => logger.error(error))
        .on("data", (row) => {
          const player = getAvgStats(row, p);
          if (player) {
            fpsData.push(player);
          }
        })
        .on("end", (rowCount: number) => {
          resolve(p);
        });
    });

    return p;
  },
};

const getOverView = (
  row: OverViewRow,
  teams: (ScrapedTeam & {
    players: ScrapedPlayer[];
  })[]
) => {
  const playerRank = parseInt(row.RK);
  const playerName = row["PLAYER NAME"];
  const pos = row.POS;
  const byeWeek = isNaN(parseInt(row["BYE WEEK"]))
    ? undefined
    : parseInt(row["BYE WEEK"]);
  const strengthOgSchedule = row["STRENGTH OF SCHEDULE "].trim();
  const abrImageMap = {
    wsh: "was",
    jax: "jac",
  };
  const teamAbr = abrImageMap[row.TEAM] ?? row.TEAM;
  const team = teams.find(
    (t) =>
      (abrImageMap[t.abr] ?? t.abr).toLowerCase() ===
      (abrImageMap[teamAbr] ?? teamAbr).toLowerCase()
  );

  const player = team?.players.find(
    (p) =>
      p.name.toLowerCase().includes(playerName.toLowerCase()) ||
      playerName.toLowerCase().includes(p.name.toLowerCase())
  );

  const fpsPlayerData: FantasyProsData = {
    id: undefined,
    playerId: player?.id,
    rank: playerRank,
    playerName: playerName,
    pos: pos,
    teamAbr,
    byeWeek: byeWeek,
    strengthOgSchedule: strengthOgSchedule,
    avgAdp: undefined,
    notes: undefined,
    avgFanPoints: undefined,
    avgPassingYds: undefined,
    avgPassingTds: undefined,
    avgReceivingRec: undefined,
    avgReceivingYds: undefined,
    avgReceivingTds: undefined,
    avgRushingAtt: undefined,
    avgRushingYds: undefined,
    avgRushingTds: undefined,
    totalFanPoints: undefined,
    totalPassingYds: undefined,
    totalPassingTds: undefined,
    totalReceivingRec: undefined,
    totalReceivingYds: undefined,
    totalReceivingTds: undefined,
    totalRushingAtt: undefined,
    totalRushingYds: undefined,
    totalRushingTds: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  };
  return fpsPlayerData;
};

const getRanks: (
  row: RanksRow,
  fpsData: FantasyProsData[]
) => FantasyProsData = (row, fpsData) => {
  // const newFPSData:FantasyProsData[] = []
  const avgAdp = row["AVG."];
  const teamAbr = row.TEAM;
  const playerName = row["PLAYER NAME"];

  fpsData = fpsData.filter((d) => {
    return d.teamAbr === teamAbr;
  });
  const player = fpsData.find((p) => {
    return p.playerName.toLowerCase() === playerName.toLowerCase();
  });
  if (player) {
    player.avgAdp = avgAdp;

    return player;
  }
};

const getNotes: (
  row: NotesRow,
  fpsData: FantasyProsData[]
) => FantasyProsData = (row, fpsData) => {
  // const newFPSData:FantasyProsData[] = []
  const notes = row["NOTES"];
  const teamAbr = row.TEAM;
  const playerName = row["PLAYER NAME"];

  fpsData = fpsData.filter((d) => {
    return d.teamAbr === teamAbr;
  });
  const player = fpsData.find((p) => {
    return p.playerName.toLowerCase() === playerName.toLowerCase();
  });
  if (player) {
    player.notes = notes;

    return player;
  }
};

const geTotalStats: (
  row: StatsRow,
  fpsData: FantasyProsData[]
) => FantasyProsData = (row, fpsData) => {
  // const newFPSData:FantasyProsData[] = []
  // const notes = row['NOTES'];
  const teamAbr = row.TEAM;
  const playerName = row["PLAYER NAME"];

  fpsData = fpsData.filter((d) => {
    return d.teamAbr === teamAbr;
  });
  const player = fpsData.find((p) => {
    return p.playerName.toLowerCase() === playerName.toLowerCase();
  });
  if (player) {
    player.totalFanPoints = parseFloat(row["FAN PTS"]);
    player.totalPassingTds = parseFloat(row["PASS TDS"]);
    player.totalPassingYds = parseFloat(row["PASS YDS"]);
    player.totalReceivingRec = parseFloat(row.REC);
    player.totalReceivingTds = parseFloat(row["REC TDS"]);
    player.totalReceivingYds = parseFloat(row["REC YDS"]);
    player.totalRushingAtt = parseFloat(row.ATT);
    player.totalRushingTds = parseFloat(row["RUSH TDS"]);
    player.totalRushingYds = parseFloat(row["RUSH YDS"]);
    return player;
  }
};

const getAvgStats: (
  row: StatsRow,
  fpsData: FantasyProsData[]
) => FantasyProsData = (row, fpsData) => {
  // const newFPSData:FantasyProsData[] = []
  // const notes = row['NOTES'];
  const teamAbr = row.TEAM;
  const playerName = row["PLAYER NAME"];

  fpsData = fpsData.filter((d) => {
    return d.teamAbr === teamAbr;
  });
  const player = fpsData.find((p) => {
    return p.playerName.toLowerCase() === playerName.toLowerCase();
  });
  if (player) {
    player.avgFanPoints = parseFloat(row["FAN PTS"]);
    player.avgPassingTds = parseFloat(row["PASS TDS"]);
    player.avgPassingYds = parseFloat(row["PASS YDS"]);
    player.avgReceivingRec = parseFloat(row.REC);
    player.avgReceivingTds = parseFloat(row["REC TDS"]);
    player.avgReceivingYds = parseFloat(row["REC YDS"]);
    player.avgRushingAtt = parseFloat(row.ATT);
    player.avgRushingTds = parseFloat(row["RUSH TDS"]);
    player.avgRushingYds = parseFloat(row["RUSH YDS"]);
    return player;
  }
};

interface OverViewRow {
  RK: string;
  TIERS: string;
  "PLAYER NAME": string;
  TEAM: string;
  POS: string;
  "BYE WEEK": string;
  "STRENGTH OF SCHEDULE ": string;
  "ECR VS. ADP": string;
  "AVG. POINTS": string;
  "% GAMES ": string;
}

interface RanksRow {
  RK: string;
  TIERS: string;
  "PLAYER NAME": string;
  TEAM: string;
  POS: string;
  Best: string;
  WORST: string;
  "AVG.": string;
  "STD.DEV": string;
  "ECR VS. ADP": string;
}

interface NotesRow {
  RK: string;
  TIERS: string;
  "PLAYER NAME": string;
  TEAM: string;
  POS: string;
  "BYE WEEK": string;
  NOTES: string;
}

interface StatsRow {
  RK: string;
  TIERS: string;
  "PLAYER NAME": string;
  TEAM: string;
  "FAN PTS": string;
  "PASS YDS": string;
  "PASS TDS": string;
  REC: string;
  "REC YDS": string;
  "REC TDS": string;
  ATT: string;
  "RUSH YDS": string;
  "RUSH TDS": string;
}
