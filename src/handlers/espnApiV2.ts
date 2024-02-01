import { listLeagues, listLeaguesWithAthleteEspnIds } from "../models/leagues";
import { espnRequestBuilder } from "../services/espnApiV2/requestBuilder";
import { espnResponseHandler } from "../services/espnApiV2/responseHandler";
import {
  listTeams,
  listTeamsWithLeagueSportSlugAndId,
  upsertTeam,
} from "../models/teams";
import { EspnApiV2 } from "../types/EspnApiV2/espnApiV2";
import { listAllNflGames, upsertTeamGame } from "../models/games";
import {
  listAthletes,
  upsertAthletes,
  upsertLeagueAthletes,
} from "../models/athletes";
import { upsertPositions } from "../models/positions";
import { upsertDepths } from "../models/depths";
import { Logger } from "winston";
import { prisma } from "..";
import { ListAllNflGamesResponse } from "../types/games";

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

export const migrateGames = async () => {
  // Getting Teams
  const teams = await listTeamsWithLeagueSportSlugAndId();

  // Getting Team Schedules
  const scheduleResponse: {
    schedule: EspnApiV2.TeamScheduleResponse;
    teamId: string;
    leagueId: string;
  }[] = await Promise.all(
    teams.map(async (t) => {
      const { sport, slug } = t.League;
      const schedule = await espnRequestBuilder.buildTeamScheduleRequest(
        sport,
        slug,
        t.espnId
      );
      return { schedule, teamId: t.id, leagueId: t.League.id };
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
      const { sport, slug } = t.League;
      const roster = await espnRequestBuilder.buildTeamRosterRequest(
        sport,
        slug,
        t.espnId
      );
      return { roster, teamId: t.id, leagueId: t.League.id };
    })
  );
  // Handling Team Roster
  const { teamAthletes, parentPositions, savedTeamRosters } =
    await espnResponseHandler.handleTeamRosterResponse(rosterResponse);

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

  return { savedParentPositions, savedAthletes, savedTeamRosters };
};

export const migrateDepths = async (logger: Logger) => {
  // Getting Teams
  const teams = await listTeamsWithLeagueSportSlugAndId();
  // Getting Team DepthCharts
  const depthChartResponse: {
    depths: EspnApiV2.TeamDepthChartResponse;
    teamId: string;
    leagueId: string;
  }[] = await Promise.all(
    teams.map(async (t) => {
      const { sport, slug } = t.League;
      const depths = await espnRequestBuilder.buildTeamDepthsRequest(
        sport,
        slug,
        t.espnId
      );
      return { depths, teamId: t.id, leagueId: t.League.id };
    })
  );
  // Handling Team DepthCharts
  const depths =
    espnResponseHandler.handleTeamDepthResponse(depthChartResponse);

  // Saving Depths
  const savedAthletes = await Promise.all(
    depths.map(async (s) => {
      return await upsertDepths(s, logger);
    })
  );

  return { savedAthletes };
};

export const migrateFreeAgentAthletes = async () => {
  // Get Leagues
  const leagueData = await listLeaguesWithAthleteEspnIds(); // Getting athletesUid

  // Getting List of Athletes Urls
  const athleteUrlsResponse: {
    athleteUrl: EspnApiV2.LeagueAthleteUrlListResponse[];
  }[] = await Promise.all(
    leagueData.map(async (ld) => {
      const { sport, slug } = ld;
      const athleteUrl = await espnRequestBuilder.buildAthleteUrlListRequest(
        sport,
        slug
      );
      return { athleteUrl };
    })
  );

  // Get Filter Athlete Urls
  const nonSavedAthleteUrls = espnResponseHandler.handleAthleteUrlListResponse(
    athleteUrlsResponse,
    leagueData
  );

  // Getting League Athletes
  const leagueAthleteResponse: {
    athlete: EspnApiV2.LeagueAthleteResponse;
    leagueId: string;
  }[] = await Promise.all(
    nonSavedAthleteUrls.map(async (nsau) => {
      const athlete = await espnRequestBuilder.buildLeagueAthleteRequest(
        nsau.athleteUrl
      );
      return { athlete, leagueId: nsau.leagueId };
    })
  );

  // Get Free Agent Athletes
  const { positions, athletes } =
    espnResponseHandler.handleLeagueAthleteResponse(leagueAthleteResponse);

  // Saving Positions
  const savedPositions = await Promise.all(
    positions.map(async (s) => {
      return await upsertPositions(s);
    })
  );
  // Saving Team Athletes
  const savedAthletes = await Promise.all(
    athletes.map(async (s) => {
      return await upsertLeagueAthletes(s);
    })
  );

  return { savedAthletes, savedPositions };
};

export const migrateGameStatistics = async (
  gameIds: string[],
  includeCompletedGames?: boolean,
  includeCompletedGameStatistics?: boolean
) => {
  // Getting Games
  const games: ListAllNflGamesResponse[] = await listAllNflGames(
    gameIds,
    includeCompletedGames,
    includeCompletedGameStatistics
  );
  // Getting Athletes
  const athletes = await listAthletes();
  // Get Game Summary
  const gameSummaryResponse: {
    gameSummary: EspnApiV2.GameSummaryResponse;
    game: ListAllNflGamesResponse;
  }[] = await Promise.all(
    games.map(async (g) => {
      const gameSummary = await espnRequestBuilder.buildGameSummaryRequest(
        g.League.sport,
        g.League.slug,
        g.espnId
      );
      return { gameSummary, game: g };
    })
  );
  // Handle Game Summary Statistics will be saved in this step
  const gameStatistics = await espnResponseHandler.handleGameSummaryResponse(
    gameSummaryResponse,
    athletes
  );

  return gameStatistics;
};

export const migrateMissingNflGames = async () => {
  // Getting Teams
  const teams = await listTeams();
  // Getting League Yearly Schedules
  const weeklyScheduleResponse: EspnApiV2.LeagueYearlyScheduleResponse =
    await espnRequestBuilder.buildOldGamesByWeekAndYear();

  // Handling Team League Yearly Schedules
  const leagueYearlyScheduleResponse =
    espnResponseHandler.handleLeagueYearlyScheduleResponse(
      weeklyScheduleResponse,
      teams
    );
  // Saving Team Games
  return await Promise.all(
    leagueYearlyScheduleResponse.map(async (s) => {
      return await upsertTeamGame(s);
    })
  );
};

export const dropEspnData = async () => {
  await prisma.depth.deleteMany();
  // await prisma.teamGame.deleteMany();
  await prisma.team.deleteMany();
  await prisma.game.deleteMany();
  await prisma.athlete.deleteMany();
  await prisma.position.deleteMany();
};
