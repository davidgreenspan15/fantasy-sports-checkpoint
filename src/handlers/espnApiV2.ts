import { listLeagues } from "../models/leagues";
import { espnRequestBuilder } from "../services/espnApiV2/requestBuilder";
import { espnResponseHandler } from "../services/espnApiV2/responseHandler";
import { listTeamsWithLeagueSportSlugAndId, upsertTeam } from "../models/teams";
import { EspnApiV2 } from "../types/EspnApiV2/espnApiV2";
import { upsertTeamGame } from "../models/teamGames";
import { upsertAthletes } from "../models/athletes";
import { upsertPositions } from "../models/positions";

export const migrateTeams = async () => {
  // Get Leagues
  const leagueData = await listLeagues();

  // Get Espn Teams
  const espnSportsTeams = await Promise.all(
    leagueData.map(async (ld) => {
      const { sport, slug } = ld;
      const teamSports = await espnRequestBuilder.buildSportsTeamsListRequest(
        sport,
        slug
      );
      return { teamSports, leagueId: ld.id };
    })
  );

  // Handle Espn Teams
  const sportsCheckpointTeams =
    espnResponseHandler.handleSportsTeamsResponse(espnSportsTeams);

  // Save Checkpoint Teams
  return await Promise.all(
    sportsCheckpointTeams.map(async (s) => {
      return await upsertTeam(s);
    })
  );
};

export const migrateTeamGames = async () => {
  // Getting Teams
  const teams = await listTeamsWithLeagueSportSlugAndId();

  // Getting Team Schedules
  const scheduleResponse: {
    schedule: EspnApiV2.TeamScheduleResponse;
    teamId: string;
    leagueId: string;
  }[] = await Promise.all(
    teams.map(async (t) => {
      const { sport, slug } = t.league;
      const schedule = await espnRequestBuilder.buildTeamScheduleRequest(
        sport,
        slug,
        t.espnId
      );
      return { schedule, teamId: t.id, leagueId: t.league.id };
    })
  );
  // Handling Team Schedules
  const sportsCheckpointTeamGames =
    espnResponseHandler.handleScheduleResponse(scheduleResponse);

  // Saving Team Games
  return await Promise.all(
    sportsCheckpointTeamGames.map(async (s) => {
      return await upsertTeamGame(s);
    })
  );
};

export const migrateTeamAthletes = async () => {
  // Getting Teams
  const teams = await listTeamsWithLeagueSportSlugAndId();

  // Getting Team Roster
  const rosterResponse: {
    roster: EspnApiV2.TeamRosterResponse;
    teamId: string;
    leagueId: string;
  }[] = await Promise.all(
    teams.map(async (t) => {
      const { sport, slug } = t.league;
      const roster = await espnRequestBuilder.buildTeamRosterRequest(
        sport,
        slug,
        t.espnId
      );
      return { roster, teamId: t.id, leagueId: t.league.id };
    })
  );
  // Handling Team Roster
  const { teamAthletes, parentPositions } =
    espnResponseHandler.handleTeamRosterResponse(rosterResponse);

  // Saving Parent Positions
  const savedParentPositions = await Promise.all(
    parentPositions.map(async (s) => {
      return await upsertPositions(s);
    })
  );
  // Saving Team Athletes
  const savedAthletes = await Promise.all(
    teamAthletes.map(async (s) => {
      return await upsertAthletes(s);
    })
  );

  return { savedAthletes, savedParentPositions };
};

////
import { Logger } from "winston";
import { Express } from "express";
import { PrismaClient } from "@prisma/client";
import { listScrapedLeagues } from "../models/scrapedLeagues";
import { getFPSPlayersForDraft } from "../models/fantasaySportsData";
import { listNflScrapedPlayersWithNoFPSData } from "../models/scrapedPlayers";
import { mergeValues } from "../util/normalizePlayers";

const prisma = new PrismaClient();

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
  const teams = await prisma.team.findMany({
    select: {
      id: true,
      abbreviation: true,
    },
  });
  const players = await prisma.athlete.findMany({
    where: {
      AND: [
        {
          dateOfBirth: {
            gte: new Date(now - twentyFourHoursFrom),
          },
        },
        {
          dateOfBirth: {
            lt: new Date(now + twentyFourHoursFrom), // 24 hours later for less than comparison
          },
        },
      ],
    },
    select: {
      fullName: true,
      teamId: true,
      dateOfBirth: true,
      position: true,
      team: {
        select: { league: { select: { abbreviation: true } } },
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
      teamGames: {
        select: {
          isHome: true,
          team: {
            select: {
              id: true,
              abbreviation: true,
            },
          },
        },
      },
    },
  });

  const playerWithBirthdays = players.reduce((ps, player) => {
    const gameToday = games.find((game) =>
      game.teamGames.find((tg) => tg.team.id === player.teamId)
    );
    if (gameToday) {
      const name = player.fullName;
      const p = {};
      p[name] = {
        player,
        gameToday,
      };
      ps.push(p);
    }
    return ps;
  }, []);
  return { playerWithBirthdays, games, teams, players };
};
export const getDraftBoard = async () => {
  const fpsPlayers = await getFPSPlayersForDraft();
  const playersWithNoFps = await listNflScrapedPlayersWithNoFPSData();
  return mergeValues(playersWithNoFps, fpsPlayers);
};

///
