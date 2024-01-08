import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";

const prisma = new PrismaClient();

// Function to parse CSV file
const parseCSV = (filePath) => {
  const results = [];
  const statCount = {};
  return new Promise((resolve, reject) => {
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
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      })
      .on("error", reject);
  });
};

// Mapping functions for each model
const mapAthleteData = (csvRow) => {
  return {
    name: csvRow.player_name,
    team: csvRow.team,
    position: csvRow.pos,
    byeWeek: parseInt(csvRow.bye_week, 10),
  };
};

const mapAverageStatData: (csvRow: any) => Prisma.FpsAverageStatCreateInput = (
  csvRow
) => {
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

const mapTotalStatData = (csvRow) => {
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

const mapRankData = (csvRow) => {
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

const mapNoteData = (csvRow) => {
  return {
    fpsAthlete: {
      connect: { name_team: { name: csvRow.player_name, team: csvRow.team } },
    },
    content: csvRow.notes,
  };
};

const mapOverviewData: (csvRow: any) => Prisma.FpsOverviewCreateInput = (
  csvRow
) => {
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
const insertAthletes = async (data) => {
  const mappedData = data.map((row) => mapAthleteData(row));
  return await prisma.fpsAthlete.createMany({
    data: mappedData,
    skipDuplicates: true,
  });
};

const insertAverageStats = async (data) => {
  const mappedData = data.map((row) => mapAverageStatData(row));
  const resp = await Promise.all(
    mappedData.map(async (row) => {
      try {
        return await prisma.fpsAverageStat.create({
          data: row,
        });
      } catch (err) {
        if (err.code === "P2002" || err.code === "P2014") {
          console.log(err);
        } else {
          throw err;
        }
      }
    })
  );
  return resp;
};

const insertTotalStats = async (data) => {
  const mappedData = data.map((row) => mapTotalStatData(row));
  const resp = await Promise.all(
    mappedData.map(async (row) => {
      try {
        return await prisma.fpsTotalStat.create({
          data: row,
        });
      } catch (err) {
        if (err.code === "P2002" || err.code === "P2014") {
          console.log(err);
        } else {
          throw err;
        }
      }
    })
  );
  return resp;
};

const insertRanks = async (data) => {
  const mappedData = data.map((row) => mapRankData(row));
  const resp = await Promise.all(
    mappedData.map(async (row) => {
      try {
        return await prisma.fpsRank.create({
          data: row,
        });
      } catch (err) {
        if (err.code === "P2002" || err.code === "P2014") {
          console.log(err);
        } else {
          throw err;
        }
      }
    })
  );
  return resp;
};

const insertNotes = async (data) => {
  const mappedData = data.map((row) => mapNoteData(row));
  const resp = await Promise.all(
    mappedData.map(async (row) => {
      try {
        return await prisma.fpsNote.create({
          data: row,
        });
      } catch (err) {
        if (err.code === "P2002" || err.code === "P2014") {
          console.log(err);
        } else {
          throw err;
        }
      }
    })
  );
  return resp;
};

const insertOverviews = async (data) => {
  const mappedData = data.map((row) => mapOverviewData(row));

  const resp = await Promise.all(
    mappedData.map(async (row) => {
      try {
        return await prisma.fpsOverview.create({
          data: row,
        });
      } catch (err) {
        if (err.code === "P2002" || err.code === "P2014") {
          console.log(err);
        } else {
          throw err;
        }
      }
    })
  );
  return resp;
};

// Main function to import CSV data
export const importCSVData = async (filePath, dataType) => {
  try {
    const data = await parseCSV(filePath);
    switch (dataType) {
      case "athlete":
        return await insertAthletes(data);
      case "averageStat":
        return await insertAverageStats(data);
      case "totalStat":
        return await insertTotalStats(data);
      case "rank":
        return await insertRanks(data);
      case "note":
        return await insertNotes(data);
      case "overview":
        return await insertOverviews(data);

      default:
        throw new Error("Invalid data type specified");
    }
  } catch (error) {
    console.error("Error importing CSV data:", error);
  }
};
