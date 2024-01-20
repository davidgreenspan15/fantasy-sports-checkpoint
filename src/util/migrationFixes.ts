import { prisma } from "..";

export const reconnectAthletesGamesTeamsToLeagues = async () => {
  const leagues = await prisma.league.findMany({
    select: {
      id: true,
      espnId: true,
    },
  });

  // Find Teams
  const teams = await prisma.team.findMany({
    select: {
      id: true,
      espnId: true,
      uid: true,
      Games: {
        select: {
          id: true,
        },
      },
    },
  });
  // Match Teams to Leagues
  const matchedTeams: {
    teamId: string;
    leagueId: string;
    Games: {
      id: string;
    }[];
  }[] = [];
  teams.forEach((team) => {
    const league = leagues.find((league) =>
      team.uid.split("~").includes(`l:${league.espnId}`)
    );
    if (league) {
      matchedTeams.push({
        teamId: team.id,
        leagueId: league.id,
        Games: team.Games,
      });
    }
  });
  // Connect Teams and Games to Leagues
  const teamAndGamesToLeagueConnectedResponse = await Promise.all(
    matchedTeams.map(async (team) => {
      const updatedTeams = await prisma.team.update({
        where: { id: team.teamId },
        data: {
          League: {
            connect: {
              id: team.leagueId,
            },
          },
        },
      });
      const updatedGames = await Promise.all(
        team.Games.map(async (game) => {
          return await prisma.game.update({
            where: { id: game.id },
            data: {
              League: {
                connect: {
                  id: team.leagueId,
                },
              },
            },
          });
        })
      );
      return { updatedTeams, updatedGames };
    })
  );

  const athletes = await prisma.athlete.findMany({
    select: {
      id: true,
      uid: true,
    },
  });
  // Match Athletes to Leagues
  const matchedAthletes: {
    athleteId: string;
    leagueId: string;
  }[] = [];
  athletes.forEach((a) => {
    const league = leagues.find((league) =>
      a.uid.split("~").includes(`l:${league.espnId}`)
    );
    if (league) {
      matchedAthletes.push({
        athleteId: a.id,
        leagueId: league.id,
      });
    }
  });

  // Connect Athletes to Leagues
  const athleteToLeagueConnectedResponse = await Promise.all(
    matchedAthletes.map(async (athlete) => {
      const updatedAthletes = await prisma.athlete.update({
        where: { id: athlete.athleteId },
        data: {
          League: {
            connect: {
              id: athlete.leagueId,
            },
          },
        },
      });
      return { updatedAthletes };
    })
  );

  return {
    teamAndGamesToLeagueConnectedResponse,
    athleteToLeagueConnectedResponse,
  };
};

export const connectSeasonsToGames = async () => {
  const mlbGames = await prisma.game.findMany({
    where: {
      League: {
        slug: "mlb",
      },
    },
  });
  const OtherGames = await prisma.game.findMany({
    where: {
      NOT: {
        League: {
          slug: "mlb",
        },
      },
    },
  });
  const connectedMlbGames = await prisma.season.update({
    where: {
      id: "3c6f8794-e6c4-41aa-a312-8bb8cb1a6a11",
    },
    data: {
      Games: {
        connect: mlbGames.map((game) => ({ id: game.id })),
      },
    },
  });
  const connectedOtherGames = await prisma.season.update({
    where: {
      id: "4eacb0c8-96cb-4637-b34d-a6f8c5dc10da",
    },
    data: {
      Games: {
        connect: OtherGames.map((game) => ({ id: game.id })),
      },
    },
  });

  return { connectedMlbGames, connectedOtherGames };
};

export const updateNflGameSeason = async () => {
  const newSeason = await prisma.season.create({
    data: {
      displayYear: "2023",
      type: 2,
      name: "Regular Season",
    },
  });
  return await prisma.game.updateMany({
    where: {
      League: {
        slug: "nfl",
      },
      Season: {
        type: 2,
        displayYear: "2023-24",
      },
    },
    data: {
      seasonId: newSeason.id,
    },
  });
};
