import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertRosters = async (roster: Prisma.RosterCreateInput) => {
  return await prisma.roster.upsert({
    where: {
      teamId_leagueId_seasonYearDisplayNumberAndType: {
        teamId: roster.Team.connect.id,
        leagueId: roster.League.connect.id,
        seasonYearDisplayNumberAndType: roster.seasonYearDisplayNumberAndType,
      },
    },
    update: roster,
    create: roster,
  });
};

export const listTeamRoster = async (
  seasonDisplayName: string,
  seasonType: number,
  teamId?: string
) => {
  const select = {
    Athletes: {
      select: {
        uid: true,
        firstName: true,
        lastName: true,
        displayName: true,
        imageUrl: true,
        number: true,
        height: true,
        weight: true,
        dateOfBirth: true,
        Position: {
          include: {
            Parent: {
              include: {
                Parent: {
                  include: {
                    Parent: {
                      include: {
                        Parent: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  const where = {
    Season: { displayYear: seasonDisplayName, type: seasonType },
  };

  if (!teamId) {
    return await prisma.roster.findFirst({
      where,
      select,
    });
  }
  return await prisma.roster.findFirst({
    where: { ...where, Team: { id: teamId } },
    select,
  });
};

export const findTeamRoster = async (game: {
  id: string;
  seasonId: string;
  espnId: string;
  name: string;
  Teams: {
    id: string;
  }[];
}) => {
  const select = {
    Team: {
      select: {
        id: true,
        displayName: true,
      },
    },
    Athletes: {
      select: {
        id: true,
        displayName: true,
        imageUrl: true,
        number: true,
        Position: {
          select: {
            displayName: true,
            parentId: true,
          },
        },
      },
    },
  };
  const rosters = await prisma.roster.findMany({
    where: {
      Season: {
        id: game?.seasonId,
      },
      OR: [
        {
          Team: {
            id: game?.Teams[0].id,
          },
        },

        {
          Team: {
            id: game?.Teams[1].id,
          },
        },
      ],
    },
    select,
  });
  if (rosters.length === 0) {
    return await prisma.roster.findMany({
      where: {
        OR: [
          {
            Team: {
              id: game?.Teams[0].id,
            },
          },

          {
            Team: {
              id: game?.Teams[1].id,
            },
          },
        ],
      },
      select,
    });
  }
  return rosters;
};
