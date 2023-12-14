import { listLeagues } from "../models/leagues";
import { espnRequestBuilder } from "../services/espnRequestBuilder";
import { espnResponseHandler } from "../services/espnResponseHandler";
import { upsertTeam } from "../models/teams";
import { League } from "@prisma/client";

export const migrateTeams = async () => {
  // Get Leagues
  const leagueData = await listLeagues();

  // Get Espn Teams
  const espnSportsTeams = await Promise.all(
    leagueData.map(async (ld) => {
      const { sport, slug } = ld;
      const sportsTeams = await espnRequestBuilder.buildSportsTeamsListRequest(
        sport,
        slug
      );
      return { sports: sportsTeams, leagueId: ld.id };
    })
  );

  // Handle Espn Teams
  const sportsCheckpointTeams = espnResponseHandler.handleSportsTeamsResponse([
    espnSportsTeams[0],
  ]);

  // Save Checkpoint Teams
  return await Promise.all(
    sportsCheckpointTeams.map(async (s) => {
      return await upsertTeam(s);
    })
  );
};

export const migratePlayers = async () => {
  let leagueData: League[] = [];
  // Get Leagues
  leagueData = await listLeagues();

  // Get Espn Teams
  const espnSportsTeams = await Promise.all(
    leagueData.map(async (ld) => {
      const { sport, slug } = ld;
      const sportsTeams = await espnRequestBuilder.buildSportsTeamsListRequest(
        sport,
        slug
      );
      return { sports: sportsTeams, leagueId: ld.id };
    })
  );

  // Handle Espn Teams
  const sportsCheckpointTeams = espnResponseHandler.handleSportsTeamsResponse([
    espnSportsTeams[0],
  ]);

  // Save Checkpoint Teams
  return await Promise.all(
    sportsCheckpointTeams.map(async (s) => {
      return await upsertTeam(s);
    })
  );
};
