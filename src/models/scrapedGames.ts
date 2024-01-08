import { Prisma } from "@prisma/client";
import logger from "../util/logger";

import { prisma } from "../index";

export const createScrapedGames = async (
  scrapedGames: Prisma.ScrapedGameCreateManyInput[]
) => {
  try {
    const gs = await prisma.scrapedGame.createMany({
      data: scrapedGames,
      skipDuplicates: true,
    });

    return gs;
  } catch (err) {
    logger.error(err);
  }
};
