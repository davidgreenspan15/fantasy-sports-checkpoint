import { Express } from "express";
import { Logger } from "winston";

import { convertFpsData } from "../handlers/csvConversion";
import {
  importFpsCSVs,
  resetFpsData,
} from "../services/fantasyProsCsv/new-converter";
import { downloadFpsCsvs } from "../services/fantasyProsCsv/CsvDownloader";
import { resetData } from "../handlers/common";

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
      // await downloadFpsCsvs();
      const resp = await importFpsCSVs();
      res.status(200).json({
        ...resp,
      });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
  app.get("/resetFpsData", async (req, res) => {
    try {
      await resetFpsData();
      res.status(200).json({ message: "Reset CSV Data" });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
};
