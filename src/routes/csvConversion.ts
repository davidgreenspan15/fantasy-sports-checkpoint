import { Express } from "express";
import { Logger } from "winston";

import { convertFpsData } from "../handlers/csvConversion";

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
};
