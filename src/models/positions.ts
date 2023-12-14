import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertPositions = async (position: Prisma.PositionCreateInput) => {
  try {
    return await prisma.position.upsert({
      where: {
        espnId_leagueId: {
          espnId: position.espnId,
          leagueId: position.league.connect.id,
        },
      },
      update: position,
      create: position,
    });
  } catch (err) {
    if (err.code === "P2002") {
      console.log(err);
    } else {
      throw err;
    }
  }
};
