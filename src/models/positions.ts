import { Prisma } from "@prisma/client";

import { prisma } from "../index";

export const upsertPositions = async (
  position: Prisma.PositionCreateInput,
  omitParent: boolean
) => {
  const positionsDeepClone = JSON.parse(JSON.stringify(position));
  if (omitParent) {
    delete positionsDeepClone["Parent"];
  }
  try {
    return await prisma.position.upsert({
      where: {
        espnId_leagueId: {
          espnId: positionsDeepClone.espnId,
          leagueId: positionsDeepClone.League.connect.id,
        },
      },
      update: positionsDeepClone,
      create: positionsDeepClone,
    });
  } catch (err) {
    if (err.code === "P2002") {
      // console.log(err);
    } else {
      throw err;
    }
  }
};

export const listParentPositions = async () => {
  return await prisma.position.findMany({
    where: {
      parentId: null,
    },
    include: {
      Children: {
        include: {
          Children: {
            include: {
              Children: {
                include: {
                  Children: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
