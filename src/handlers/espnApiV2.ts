import { listLeagues, listLeaguesWithAthleteEspnIds } from "../models/leagues";
import { espnRequestBuilder } from "../services/espnApiV2/requestBuilder";
import { espnResponseHandler } from "../services/espnApiV2/responseHandler";
import {
  connectDivisionToTeam,
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
import { upsertConferences } from "../models/conferences";
import { upsertDivisions } from "../models/divisions";

export const migrateConferenceAndDivisions = async () => {
  // Get Leagues
  const leagueData = await listLeagues();

  // Getting List of Position Urls
  const conferenceAndDivisionUrlsResponse: {
    conferenceUrls: EspnApiV2.ResponseCoreList.Item[];
    divisionalConference: {
      urls: EspnApiV2.ResponseCoreList.Item[];
      conferenceId: string;
    }[];
    league: {
      id: string;
      sport: string;
      slug: string;
    };
  }[] = await Promise.all(
    leagueData.map(async (ld) => {
      const { sport, slug } = ld;
      const conferenceUrls =
        await espnRequestBuilder.buildConferencesUrlListRequest(sport, slug);

      const divisionalConference = await Promise.all(
        conferenceUrls.map(async (ci) => {
          const confSplit = ci.$ref.split("/");
          const conference = confSplit[confSplit.length - 1].split("?")[0];
          const urls = await espnRequestBuilder.buildDivisionsUrlListRequest(
            sport,
            slug,
            conference
          );
          return { urls, conferenceId: conference };
        })
      );
      return {
        conferenceUrls,
        divisionalConference,
        league: { id: ld.id, slug, sport },
      };
    })
  );

  // Getting League Groups For Each Conference and Division
  const leagueGroupsResponse: {
    conferences: EspnApiV2.GroupResponse[];
    divisions: {
      resp: {
        division: EspnApiV2.ResponseGroup.Group;
        divisionTeams: {
          divisionId: string;
          leagueId: string;
          teamId: string;
        }[];
      }[];
      conferenceId: string;
    }[];
    leagueId: string;
  }[] = await Promise.all(
    conferenceAndDivisionUrlsResponse.map(async (cdUrls) => {
      const conferences = await Promise.all(
        cdUrls.conferenceUrls.map(async (i) => {
          const conference =
            await espnRequestBuilder.buildLeagueConferenceAndDivisionRequest(
              i.$ref
            );
          return conference;
        })
      );

      const divisions = await Promise.all(
        cdUrls.divisionalConference.map(async (dc) => {
          const resp = await Promise.all(
            dc.urls.map(async (i) => {
              const division =
                await espnRequestBuilder.buildLeagueConferenceAndDivisionRequest(
                  i.$ref
                );

              const teamsToConnectToDivision =
                await espnRequestBuilder.buildDivisionTeamsUrlListRequest(
                  cdUrls.league.sport,
                  cdUrls.league.slug,
                  division.id
                );

              const divisionTeams =
                espnResponseHandler.handleTeamToConnectToDivisionsResponse(
                  teamsToConnectToDivision,
                  division.id,
                  cdUrls.league.id
                );

              return { division, divisionTeams };
            })
          );
          return { resp, conferenceId: dc.conferenceId };
        })
      );
      return { conferences, divisions, leagueId: cdUrls.league.id };
    })
  );

  // Handle Espn Groups
  const { conferences, divisions, teamDivisions } =
    espnResponseHandler.handleGroupsResponse(leagueGroupsResponse);

  // Save Conferences
  const savedConferences = await Promise.all(
    conferences.map(async (c) => {
      return await upsertConferences(c);
    })
  );

  // Save Divisions
  const savedDivisions = await Promise.all(
    divisions.map(async (d) => {
      return await upsertDivisions(d);
    })
  );

  // Connect Divisions to Teams
  const savedDivisionToTeamConnections = await Promise.all(
    teamDivisions.map(async (s) => {
      return await connectDivisionToTeam(s);
    })
  );

  return { savedConferences, savedDivisions, savedDivisionToTeamConnections };
};

export const migratePositions = async () => {
  // Get Leagues
  const leagueData = await listLeagues();

  // Getting List of Position Urls
  const positionsUrlsResponse: {
    positionUrls: EspnApiV2.CoreListResponse;
    leagueId: string;
  }[] = await Promise.all(
    leagueData.map(async (ld) => {
      const { sport, slug } = ld;
      const positionUrls =
        await espnRequestBuilder.buildPositionsUrlListRequest(sport, slug);
      return { positionUrls, leagueId: ld.id };
    })
  );

  // Getting League Positions
  const leaguePositionsResponse: {
    positions: EspnApiV2.PositionResponse[];
    leagueId: string;
  }[] = await Promise.all(
    positionsUrlsResponse.map(async (pUrls) => {
      const positions = await Promise.all(
        pUrls.positionUrls.items.map(async (i) => {
          const position = await espnRequestBuilder.buildLeaguePositionRequest(
            i.$ref
          );
          return position;
        })
      );

      return { positions, leagueId: pUrls.leagueId };
    })
  );

  // Handle Espn Teams
  const positionResponses = espnResponseHandler.handlePositionsResponse(
    leaguePositionsResponse
  );

  // Save Positions without Parent
  const firstRound = await Promise.all(
    positionResponses.map(async (s) => {
      return await upsertPositions(s, true);
    })
  );
  // Connect Parent Positions
  const secondRound = await Promise.all(
    positionResponses.map(async (s) => {
      return await upsertPositions(s, false);
    })
  );

  return { firstRound, secondRound };
};

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
  const { teamAthletes, savedTeamRosters } =
    await espnResponseHandler.handleTeamRosterResponse(rosterResponse);

  // Saving Team Athletes
  const savedAthletes = await Promise.all(
    teamAthletes.map(async (s) => {
      return await upsertAthletes(s);
    })
  );

  return { savedAthletes, savedTeamRosters };
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
  const { athletes } = espnResponseHandler.handleLeagueAthleteResponse(
    leagueAthleteResponse
  );

  // Saving Team Athletes
  const savedAthletes = await Promise.all(
    athletes.map(async (s) => {
      return await upsertLeagueAthletes(s);
    })
  );

  return { savedAthletes };
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
