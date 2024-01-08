import { Prisma } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";
import {
  createFpsAthletes,
  deleteAllFpsAthletes,
} from "../../models/fpsAthletes";
import {
  FPSAverageStatData,
  FPSData,
  FPSNoteData,
  FPSOverviewData,
  FPSRankData,
  FPSTotalStatData,
} from "../../types/fpsData";
import {
  createFpsOverview,
  deleteAllFpsOverviews,
} from "../../models/fpsOverviews";
import { createFpsNote, deleteAllFpsNotes } from "../../models/fpsNotes";
import { createFpsRank, deleteAllFpsRanks } from "../../models/fpsRanks";
import {
  createFpsTotalStat,
  deleteAllFpsTotalStats,
} from "../../models/fpsTotalStats";
import {
  createFpsAverageStat,
  deleteAllFpsAverageStats,
} from "../../models/fpsAverageStats";
const fileCheck = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist at ${filePath}`);
  }
  return true;
};
// Function to parse CSV file
const parseCSV = async (filePath: string) => {
  const results: FPSData[] = [];
  const statCount = {};
  return new Promise<FPSData[]>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => {
            let h = header;
            if (filePath.includes("Stats")) {
              if (header === "YDS" || header === "TDS") {
                if (statCount[header]) {
                  if (statCount[header] === 1) {
                    h = `REC ${header}`;
                  }
                  if (statCount[header] === 2) {
                    h = `RUSH ${header}`;
                  }
                  statCount[header] += 1;
                } else {
                  h = `PASS ${header}`;
                  statCount[header] = 1;
                }
              }
              return h.toLowerCase().split(" ").join("_");
            } else {
              return h.toLowerCase().split(" ").join("_");
            }
          },
        })
      )
      .on("data", (data) => results.push(data as FPSData))
      .on("end", () => {
        resolve(results as FPSData[]);
      })
      .on("error", reject);
  });
};

// Mapping functions for each model
const mapAthleteData: (
  csvRow: FPSOverviewData
) => Prisma.FpsAthleteCreateManyInput = (csvRow) => {
  return {
    name: csvRow.player_name,
    team: csvRow.team,
    position: csvRow.pos,
    byeWeek: parseInt(csvRow.bye_week, 10),
  };
};

const mapAverageStatData: (
  csvRow: FPSAverageStatData
) => Prisma.FpsAverageStatCreateInput = (csvRow) => {
  return {
    fpsAthlete: {
      connect: { name_team: { name: csvRow.player_name, team: csvRow.team } },
    },
    tiers: parseInt(csvRow.tiers),
    fanPts: parseFloat(csvRow.fan_pts),
    yardsPassing: parseFloat(csvRow.pass_yds),
    tdsPassing: parseFloat(csvRow.pass_tds),
    rec: parseInt(csvRow.rec),
    yardsReceiving: parseFloat(csvRow.rec_yds),
    tdsReceiving: parseFloat(csvRow.rec_tds),
    att: parseInt(csvRow.att),
    yardsRushing: parseFloat(csvRow.rush_yds),
    tdsRushing: parseFloat(csvRow.rush_tds),
  };
};

const mapTotalStatData: (
  csvRow: FPSTotalStatData
) => Prisma.FpsTotalStatCreateInput = (csvRow) => {
  return {
    fpsAthlete: {
      connect: { name_team: { name: csvRow.player_name, team: csvRow.team } },
    },
    tiers: parseInt(csvRow.tiers),
    fanPts: parseFloat(csvRow.fan_pts),
    yardsPassing: parseFloat(csvRow.pass_yds),
    tdsPassing: parseFloat(csvRow.pass_tds),
    rec: parseInt(csvRow.rec),
    yardsReceiving: parseFloat(csvRow.rec_yds),
    tdsReceiving: parseFloat(csvRow.rec_tds),
    att: parseInt(csvRow.att),
    yardsRushing: parseFloat(csvRow.rush_yds),
    tdsRushing: parseFloat(csvRow.rush_tds),
  };
};

const mapRankData: (csvRow: FPSRankData) => Prisma.FpsRankCreateInput = (
  csvRow
) => {
  return {
    fpsAthlete: {
      connect: { name_team: { name: csvRow.player_name, team: csvRow.team } },
    },
    tiers: parseInt(csvRow.tiers),
    best: parseInt(csvRow.best),
    worst: parseInt(csvRow.worst),
    avg: parseFloat(csvRow["avg."]),
    stdDev: parseFloat(csvRow["std.dev"]),
    ecrVsAdp: isNaN(parseFloat(csvRow["ecr_vs._adp"]))
      ? -0.0
      : parseFloat(csvRow["ecr_vs._adp"]),
  };
};

const mapNoteData: (csvRow: FPSNoteData) => Prisma.FpsNoteCreateInput = (
  csvRow
) => {
  return {
    fpsAthlete: {
      connect: { name_team: { name: csvRow.player_name, team: csvRow.team } },
    },
    content: csvRow.notes,
  };
};

const mapOverviewData: (
  csvRow: FPSOverviewData
) => Prisma.FpsOverviewCreateInput = (csvRow) => {
  return {
    fpsAthlete: {
      connect: { name_team: { name: csvRow.player_name, team: csvRow.team } },
    },
    sos: isNaN(parseFloat(csvRow.strength_of_schedule_))
      ? -0.0
      : parseFloat(csvRow.strength_of_schedule_),
    ecrVsAdp: isNaN(parseFloat(csvRow["ecr_vs._adp"]))
      ? -0.0
      : parseFloat(csvRow["ecr_vs._adp"]),
    avgPts: isNaN(parseFloat(csvRow["avg._points_"]))
      ? -0.0
      : parseFloat(csvRow["avg._points_"]),
    pctGames: csvRow["%_games_"],
  };
};

// Insertion functions for each model

const insertAthletes = async (data: FPSOverviewData[]) => {
  const mappedData = data.map((row) => mapAthleteData(row));
  return await createFpsAthletes(mappedData);
};

const insertAverageStats = async (data: FPSAverageStatData[]) => {
  const mappedData = data.map((row) => mapAverageStatData(row));
  return await Promise.all(
    mappedData.map(async (row) => {
      return await createFpsAverageStat(row);
    })
  );
};

const insertTotalStats = async (data: FPSTotalStatData[]) => {
  const mappedData = data.map((row) => mapTotalStatData(row));
  return await Promise.all(
    mappedData.map(async (row) => {
      return await createFpsTotalStat(row);
    })
  );
};

const insertRanks = async (data: FPSRankData[]) => {
  const mappedData = data.map((row) => mapRankData(row));
  return await Promise.all(
    mappedData.map(async (row) => {
      return await createFpsRank(row);
    })
  );
};

const insertNotes = async (data: FPSNoteData[]) => {
  const mappedData = data.map((row) => mapNoteData(row));
  return await Promise.all(
    mappedData.map(async (row) => {
      return await createFpsNote(row);
    })
  );
};

const insertOverviews = async (data: FPSOverviewData[]) => {
  const mappedData = data.map((row) => mapOverviewData(row));
  return await Promise.all(
    mappedData.map(async (row) => {
      return await createFpsOverview(row);
    })
  );
};

// Main function to import CSV data
export const importCSVData = async (filePath: string, dataType: string) => {
  try {
    const exists = fileCheck(filePath);
    console.log("Exists:", exists);
    const data = await parseCSV(filePath);
    console.log("Data:", data);
    switch (dataType) {
      case "athlete":
        return await insertAthletes(data as FPSOverviewData[]);
      case "averageStat":
        return await insertAverageStats(data as FPSAverageStatData[]);
      case "totalStat":
        return await insertTotalStats(data as FPSTotalStatData[]);
      case "rank":
        return await insertRanks(data as FPSRankData[]);
      case "note":
        return await insertNotes(data as FPSNoteData[]);
      case "overview":
        return await insertOverviews(data as FPSOverviewData[]);

      default:
        throw new Error("Invalid data type specified");
    }
  } catch (error) {
    console.error("Error importing CSV data:", error);
  }
};

export const importFpsCSVs = async () => {
  await resetFpsData();
  const athletes = await importCSVData(
    "src/csv/fps/FantasyPros_Draft_Overview.csv",
    "athlete"
  );
  const overview = await importCSVData(
    "src/csv/fps/FantasyPros_Draft_Overview.csv",
    "overview"
  );
  const ranks = await importCSVData(
    "src/csv/fps/FantasyPros_Draft_Ranks.csv",
    "rank"
  );
  const notes = await importCSVData(
    "src/csv/fps/FantasyPros_Draft_Notes.csv",
    "note"
  );
  const totalStats = await importCSVData(
    "src/csv/fps/FantasyPros_Draft_Total_Stats.csv",
    "totalStat"
  );
  const averageStats = await importCSVData(
    "src/csv/fps/FantasyPros_Draft_Average_Stats.csv",
    "averageStat"
  );
  return {
    athletes,
    overview,
    ranks,
    notes,
    totalStats,
    averageStats,
  };
};

const resetFpsData = async () => {
  console.log("Deleting all FPS data");
  await deleteAllFpsAverageStats();
  console.log("Deleted all FPS Average Stats");
  await deleteAllFpsTotalStats();
  console.log("Deleted all FPS Total Stats");
  await deleteAllFpsNotes();
  console.log("Deleted all FPS Notes");
  await deleteAllFpsOverviews();
  console.log("Deleted all FPS Overviews");
  await deleteAllFpsRanks();
  console.log("Deleted all FPS Ranks");
  await deleteAllFpsAthletes();
};
