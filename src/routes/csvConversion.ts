import { Express } from "express";
import { Logger } from "winston";

import { convertFpsData } from "../handlers/csvConversion";
import { importCSVData } from "../services/fantasyProsCsv/new-converter";

export const csvConversionRoutes = (app: Express, logger: Logger) => {
  app.get("/convertFpsData", async (req, res) => {
    try {
      const fpsData = await convertFpsData();
      res.status(200).json({ fpsData });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
  app.get("/importCSVData", async (req, res) => {
    try {
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
      res.status(200).json({
        athletes,
        overview,
        ranks,
        notes,
        totalStats,
        averageStats,
      });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
};
