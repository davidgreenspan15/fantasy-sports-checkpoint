import { PrismaClient } from "@prisma/client";
import { Express } from "express";
import { Logger } from "winston";

import { getDraftBoard, resetData, todaysBirthday } from "../handlers/common";
import { listScrapedLeagues } from "../models/scrapedLeagues";
import { prisma } from "..";

export const commonRoutes = (app: Express, logger: Logger) => {
  app.get("/resetData", async (req, res) => {
    try {
      await resetData();
      res.status(200).json({ message: "Data Reset" });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
  app.get("/getPlayers", async (req, res) => {
    try {
      const leagues = await listScrapedLeagues();
      res.status(200).json({ leagues });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  app.get("/todaysBirthday", async (req, res) => {
    try {
      const playersWithBirthdayAndGame = await todaysBirthday();
      res.status(200).json(playersWithBirthdayAndGame);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  app.get("/getDraftBoard", async (req, res) => {
    try {
      const players = await getDraftBoard();
      res.status(200).json({ players });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });

  app.post("/query", async (req, res) => {
    const query = req.body.query;
    try {
      const result = await prisma.$queryRawUnsafe(query);
      res.status(200).json(result);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ err });
    }
  });
};
