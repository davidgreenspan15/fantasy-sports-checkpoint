import { prisma } from "..";
import { getFPSPlayersForDraft } from "../models/fantasaySportsData";
import { listNflScrapedPlayersWithNoFPSData } from "../models/scrapedPlayers";
import { mergeValues } from "../util/normalizePlayers";

export const resetData = async () => {
  await prisma.fantasyProsData.deleteMany({});
  await prisma.scrapedPlayer.deleteMany({});
  await prisma.scrapedGame.deleteMany({});
  await prisma.scrapedTeam.deleteMany({});
};

export const todaysBirthday = async () => {
  const now = Date.now();
  const twentyFourHoursFrom = +12 * 60 * 60 * 1000;

  const d = new Date();
  const players = await prisma.athlete.findMany({
    where: {
      birthday: { startsWith: `${d.getMonth() + 1}/${d.getDate()}/` },
    },
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
        },
      },
    },
  });

  const games = await prisma.game.findMany({
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
      TeamGames: {
        select: {
          isHome: true,
          Team: {
            select: {
              id: true,
              name: true,
              abbreviation: true,
            },
          },
        },
      },
    },
  });

  const playerWithBirthdays = players.reduce((ps, player) => {
    const game = games.find((game) =>
      game.TeamGames.find((tg) => tg.Team.id === player.Team.id)
    );
    if (game) {
      const p = {
        ...player,
        game,
      };
      ps.push(p);
    }
    return ps;
  }, []);
  return { playerWithBirthdays };
};
export const getDraftBoard = async () => {
  const fpsPlayers = await getFPSPlayersForDraft();
  const playersWithNoFps = await listNflScrapedPlayersWithNoFPSData();
  return mergeValues(playersWithNoFps, fpsPlayers);
};
