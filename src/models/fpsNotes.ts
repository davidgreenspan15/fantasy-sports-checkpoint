import { Prisma } from "@prisma/client";

import { prisma } from "../index";

export const createFpsNote = async (data: Prisma.FpsNoteCreateInput) => {
  try {
    return await prisma.fpsNote.create({
      data,
    });
  } catch (err) {
    if (err.code === "P2002" || err.code === "P2014") {
      // console.log(err);
    } else {
      throw err;
    }
  }
};
export const deleteAllFpsNotes = async () => {
  return await prisma.fpsNote.deleteMany({});
};
