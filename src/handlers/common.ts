import { prisma } from "..";
import { getFPSPlayersForDraft } from "../models/fantasaySportsData";
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
      parentPositionId: "70",
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
        select: {
          NflStatistic: {
            select: {
              PassingStatistics: true,
              RushingStatistics: true,
              ReceivingStatistics: true,
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
