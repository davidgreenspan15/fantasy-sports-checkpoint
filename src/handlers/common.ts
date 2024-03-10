import { prisma } from "..";
import { getFPSPlayersForDraft } from "../models/fantasaySportsData";
import { listLeaguesWithTeams } from "../models/leagues";
import { listNflScrapedPlayersWithNoFPSData } from "../models/scrapedPlayers";
import { mergeValues } from "../util/normalizePlayers";
const twentyFourHoursFrom = +12 * 60 * 60 * 1000;

export const resetData = async () => {
  await prisma.fantasyProsData.deleteMany({});
  await prisma.scrapedPlayer.deleteMany({});
  await prisma.scrapedGame.deleteMany({});
  await prisma.scrapedTeam.deleteMany({});
};

export const todaysBirthday = async (date?: Date) => {
  const now = date ? new Date(date).getTime() : Date.now();

  const d = new Date(now);
  const where = {
    birthday: { startsWith: `${d.getMonth() + 1}/${d.getDate()}/` },
  };
  if (date) {
    where["Position"] = {
      OR: [{ espnId: "1" }, { espnId: "9" }, { espnId: "7" }],
    };
  }
  const players = await prisma.athlete.findMany({
    where,
    select: {
      fullName: true,
      dateOfBirth: true,
      birthday: true,
      espnUrl: true,
      Position: {
        select: {
          name: true,
          abbreviation: true,
        },
      },
      Team: {
        select: {
          id: true,
          name: true,
          abbreviation: true,
          League: { select: { abbreviation: true } },
          Games: {
            where: {
              AND: [
                {
                  date: {
                    gte: new Date(now - twentyFourHoursFrom),
                  },
                },
                {
                  date: {
                    lt: new Date(now + twentyFourHoursFrom), // 24 hours later for less than comparison
                  },
                },
              ],
            },
            select: {
              date: true,
              name: true,
              week: true,
            },
          },
        },
      },
      AthleteGameStatistic: {
        where: {
          GameStatistic: {
            Game: {
              AND: [
                {
                  date: {
                    gte: new Date(now - twentyFourHoursFrom),
                  },
                },
                {
                  date: {
                    lt: new Date(now + twentyFourHoursFrom), // 24 hours later for less than comparison
                  },
                },
              ],
            },
          },
        },
        select: {
          NflStatistic: {
            where: {
              AthleteGameStatistic: {
                GameStatistic: {
                  Game: {
                    AND: [
                      {
                        date: {
                          gte: new Date(now - twentyFourHoursFrom),
                        },
                      },
                      {
                        date: {
                          lt: new Date(now + twentyFourHoursFrom), // 24 hours later for less than comparison
                        },
                      },
                    ],
                  },
                },
              },
            },
            select: {
              PassingStatistic: true,
              RushingStatistic: true,
              ReceivingStatistic: true,
            },
          },
        },
      },
    },
  });
  const playerWithBirthdays = players
    .filter((p) => p.Team?.Games.length > 0)
    .map((p) => {
      p.Team.Games.map((g) => {
        g["Formatted Dated"] = g.date.toLocaleString();
        return g;
      });
      return p;
    });

  return { playerWithBirthdays };
};

export const getDraftBoard = async () => {
  const fpsPlayers = await getFPSPlayersForDraft();
  const playersWithNoFps = await listNflScrapedPlayersWithNoFPSData();
  return mergeValues(playersWithNoFps, fpsPlayers);
};

export const getLeaguesWithTeams = async () => {
  const lT = await listLeaguesWithTeams();

  // create unique list of Season displayYear and Type for each team
  const mappedLt = lT.map((l) => {
    l.Teams.map((t) => {
      const GameSeason = { displayYears: [], types: [] };
      const gameDisplayYearHash = {};
      const gameTypeHash = {};
      t.Games.forEach((g) => {
        gameDisplayYearHash[g.Season.displayYear] = g.Season.displayYear;
        gameTypeHash[g.Season.type] = {
          name: g.Season.name,
          type: g.Season.type,
        };
      });
      GameSeason.displayYears = Object.keys(gameDisplayYearHash);
      GameSeason.types = Object.values(gameTypeHash);

      const RosterSeason = { displayYears: [], types: [] };
      const rosterDisplayYearHash = {};
      const rosterTypeHash = {};
      t.Roster.forEach((r) => {
        rosterDisplayYearHash[r.Season.displayYear] = r.Season.displayYear;
        rosterTypeHash[r.Season.type] = {
          name: r.Season.name,
          type: r.Season.type,
        };
      });
      RosterSeason.displayYears = Object.keys(rosterDisplayYearHash);
      RosterSeason.types = Object.values(rosterTypeHash);
      t["GameSeason"] = GameSeason;
      t["RosterSeason"] = RosterSeason;
      delete t.Roster;
      delete t.Games;

      return t;
    });
    return l;
  });
  return mappedLt;
};
