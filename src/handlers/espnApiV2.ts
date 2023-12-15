import { listLeagues } from "../models/leagues";
import { espnRequestBuilder } from "../services/espnApiV2/requestBuilder";
import { espnResponseHandler } from "../services/espnApiV2/responseHandler";
import { listTeamsWithLeagueSportSlugAndId, upsertTeam } from "../models/teams";
import { EspnApiV2 } from "../types/EspnApiV2/espnApiV2";
import { upsertTeamGame } from "../models/teamGames";
import { upsertAthletes } from "../models/athletes";
import { upsertPositions } from "../models/positions";
import { upsertDepths } from "../models/depths";
import { Logger } from "winston";

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
      const { sport, slug } = t.league;
      const depths = await espnRequestBuilder.buildTeamDepthsRequest(
        sport,
        slug,
        t.espnId
      );
      return { depths, teamId: t.id, leagueId: t.league.id };
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

// Todo
export const migrateFreeAgentAthletes = async () => {
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
