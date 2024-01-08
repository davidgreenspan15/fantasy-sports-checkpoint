import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFpsNote = async (data: Prisma.FpsNoteCreateInput) => {
  try {
    return await prisma.fpsNote.create({
      data,
    });
  } catch (err) {
    if (err.code === "P2002" || err.code === "P2014") {
      console.log(err);
    } else {
      throw err;
    }
  }
};
