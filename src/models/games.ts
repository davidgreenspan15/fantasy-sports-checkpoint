import { Prisma } from "@prisma/client";

import { prisma } from "../index";
export const upsertTeamGame = async (game: Prisma.GameCreateInput) => {
  try {
    return await prisma.game.upsert({
      where: {
        espnId_leagueId: {
          leagueId: game.League.connect.id,
          espnId: game.espnId,
        },
      },
      update: game,
      create: game,
    });
  } catch (e) {
    if (e.code === "P2002") {
      try {
        return await prisma.game.upsert({
          where: {
            espnId_leagueId: {
              leagueId: game.League.connect.id,
              espnId: game.espnId,
            },
          },
          update: game,
          create: game,
        });
      } catch (e) {
        if (e.code === "P2002") {
          console.log(e);
        }
      }
    } else {
      throw e;
    }
  }
};

export const listAllNflGames = async (
  gameIds: string[],
  isGameComplete?: boolean,
  isGameStatisticComplete?: boolean
) => {
  const whereClause = {
    League: {
      OR: [{ slug: "nba" }, { slug: "nfl" }, { slug: "nhl" }, { slug: "mlb" }],
    },
  };
  if (gameIds.length > 0) {
    whereClause["id"] = {
      in: gameIds,
    };
  }
  if (isGameComplete) {
    whereClause["isComplete"] = true;
  }
  if (isGameStatisticComplete === true) {
    whereClause["Statistics"] = {
      isComplete: true,
    };
  } else if (isGameStatisticComplete === false) {
    whereClause["OR"] = [
      { Statistics: null },
      {
        Statistics: {
          isComplete: false,
        },
      },
    ];
  }
  return await prisma.game.findMany({
    where: whereClause,
    select: {
      id: true,
      espnId: true,
      isComplete: true,
      awayTeamId: true,
      homeTeamId: true,
      League: {
        select: {
          slug: true,
          sport: true,
          id: true,
        },
      },
      AwayTeam: { select: { espnId: true, id: true } },
      HomeTeam: { select: { espnId: true, id: true } },
      Statistics: {
        select: {
          id: true,
          jsonPayload: true,
          isComplete: true,
        },
      },
    },
  });
};

export const listTeamGames = async (
  seasonDisplayName: string,
  seasonType: number,
  teamId?: string
) => {
  const select = {
    id: true,
    espnId: true,
    date: true,
    name: true,
    shortName: true,
    week: true,
    isComplete: true,
    homeTeamId: true,
    HomeTeam: {
      select: {
        id: true,
        name: true,
        abbreviation: true,
        displayName: true,
        location: true,
        imageUrl: true,
        color: true,
        alternateColor: true,
      },
    },
    awayTeamId: true,
    AwayTeam: {
      select: {
        id: true,
        name: true,
        abbreviation: true,
        displayName: true,
        location: true,
        imageUrl: true,
        color: true,
        alternateColor: true,
      },
    },
    period: true,
    Statistics: {
      select: {
        TeamGameStatistics: {
          select: {
            teamId: true,
            teamScore: true,
          },
        },
        isComplete: true,
      },
    },
  };
  const where = {
    Season: { displayYear: seasonDisplayName, type: seasonType },
  };

  if (!teamId) {
    return await prisma.game.findMany({
      where,
      select,
      orderBy: { date: "asc" },
    });
  }
  return await prisma.game.findMany({
    where: {
      ...where,
      OR: [{ HomeTeam: { id: teamId } }, { AwayTeam: { id: teamId } }],
    },
    select,
    orderBy: { date: "asc" },
  });
};

export const updateGameIsComplete = async (id: string) => {
  return await prisma.game.update({
    where: {
      id: id,
    },
    data: {
      isComplete: true,
    },
  });
};

export const updateGameStatus = async (
  id: string,
  timeOnClock: string,
  period: number,
  isComplete: boolean
) => {
  return await prisma.game.update({
    where: {
      id: id,
    },
    data: {
      timeOnClock,
      period,
      isComplete,
    },
  });
};

export const getGameById = async (gameId: string) => {
  const gameStatistics = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    select: {
      timeOnClock: true,
      period: true,
      isComplete: true,
      id: true,
      name: true,
      espnId: true,
      seasonId: true,
      homeTeamId: true,
      awayTeamId: true,
      date: true,
      shortName: true,
      week: true,
      Statistics: {
        select: {
          isComplete: true,
        },
      },
      HomeTeam: {
        select: {
          id: true,
          name: true,
          abbreviation: true,
          displayName: true,
          location: true,
          imageUrl: true,
          color: true,
          alternateColor: true,
        },
      },
      AwayTeam: {
        select: {
          id: true,
          name: true,
          abbreviation: true,
          displayName: true,
          location: true,
          imageUrl: true,
          color: true,
          alternateColor: true,
        },
      },
    },
  });

  return gameStatistics;
};

export const listAllGamesWithGameStatistics = async () => {
  return await prisma.game.findMany({
    where: {
      // Payloads become too big so need to break it down
      // League:{
      //   OR: [{ slug: "nba" }, { slug: "nfl" }, { slug: "nhl" }],
      // },
      Statistics: {
        jsonPayload: {
          not: null,
        },
      },
    },
    select: {
      id: true,
      espnId: true,
      isComplete: true,
      awayTeamId: true,
      homeTeamId: true,
      League: {
        select: {
          slug: true,
          sport: true,
          id: true,
        },
      },
      HomeTeam: { select: { espnId: true, id: true } },
      AwayTeam: { select: { espnId: true, id: true } },
      Statistics: {
        select: {
          id: true,
          jsonPayload: true,
          isComplete: true,
        },
      },
    },
  });
};
