import { Athlete, Prisma } from "@prisma/client";

import { EspnApiV2 } from "../../types/EspnApiV2/espnApiV2";
import { ListAllNflGamesResponse } from "../../types/games";
import {
  createAthleteGameStatistics,
  createDepth,
  createGame,
  createGameStatistic,
  createLeagueAthlete,
  createTeam,
  createTeamAthlete,
  createTeamGameStatistics,
  mapIdenticalGames,
} from "./responseHandlerHelpers";
import { updateGameStatisticsIsComplete } from "../../models/GameStatistics";

export const espnResponseHandler = {
  handleSportsTeamsResponse: (
    sportTeamListResponses: {
      teamSports: EspnApiV2.TeamListResponse;
      leagueId: string;
    }[]
  ) => {
    const teams: Prisma.TeamCreateInput[] = [];
    sportTeamListResponses.forEach((str) => {
      const sport = str.teamSports.sports[0];
      const league = sport.leagues[0];

      return league.teams.forEach((t) => {
        const team = createTeam(t.team, str.leagueId);
        teams.push(team);
      });
    });
    return teams;
  },
  handleScheduleResponse: (
    scheduleResponse: {
      schedule: EspnApiV2.TeamScheduleResponse;
      teamId: string;
      leagueId: string;
    }[]
  ) => {
    const games: Prisma.GameCreateInput[] = [];
    const uniqueGames = mapIdenticalGames(scheduleResponse);
    uniqueGames.forEach((g) => {
      const game = createGame(g.event, g.homeTeamId, g.leagueId, g.awayTeamId);
      games.push(game);
    });
    // Connect Identical Games

    return games;
  },
  handleTeamRosterResponse: (
    rosterResponse: {
      roster: EspnApiV2.TeamRosterResponse;
      teamId: string;
      leagueId: string;
    }[]
  ) => {
    const teamAthletes: Prisma.AthleteCreateInput[] = [];
    const parentPositions: Prisma.PositionCreateInput[][] = [];

    rosterResponse.forEach((sr) => {
      sr.roster.athletes.forEach((a) => {
        a.items?.forEach((i) => {
          const { teamAthlete, positions } = createTeamAthlete(
            i,
            sr.teamId,
            sr.leagueId
          );
          teamAthletes.push(teamAthlete);
          if (positions) {
            parentPositions.push(positions);
          }
        });
      });
    });
    return { teamAthletes, parentPositions: parentPositions.flat() };
  },
  handleTeamDepthResponse: (
    depthChartResponse: {
      depths: EspnApiV2.TeamDepthChartResponse;
      teamId: string;
      leagueId: string;
    }[]
  ) => {
    const depths: Prisma.DepthCreateInput[][] = [];

    depthChartResponse.forEach((sr) => {
      sr.depths.items.forEach((i) => {
        const depth = createDepth(i, sr.leagueId);
        depths.push(depth);
      });
    });
    return depths.flat();
  },
  handleAthleteUrlListResponse: (
    athleteUrlsResponse: {
      athleteUrl: EspnApiV2.LeagueAthleteUrlListResponse[];
    }[],
    leagueWithAthleteEspnIds: ({
      Athletes: {
        espnId: string;
      }[];
    } & {
      id: string;
      espnId: string;
      name: string;
      shortName: string;
      abbreviation: string;
      slug: string;
      sport: string;
      createdAt: Date;
      updatedAt: Date;
    })[]
  ) => {
    const nonSavedAthleteUrls: { leagueId: string; athleteUrl: string }[] = [];
    athleteUrlsResponse.forEach((aur) => {
      aur.athleteUrl.forEach((a) => {
        a.items.forEach((athlete) => {
          const splitRef = athlete.$ref.split("/");
          const refSlug = splitRef[7];
          const espnId = splitRef[splitRef.length - 1].split("?")[0];
          const league = leagueWithAthleteEspnIds.find((l) => {
            return l.slug === refSlug;
          });
          const isSaved = league?.Athletes.find((aEId) => {
            return aEId.espnId === espnId;
          });

          if (league && !isSaved) {
            nonSavedAthleteUrls.push({
              athleteUrl: athlete.$ref,
              leagueId: league?.id,
            });
          } else {
          }
        });
      });
    });
    return nonSavedAthleteUrls;
  },
  handleLeagueAthleteResponse: (
    leagueAthleteResponse: {
      athlete: EspnApiV2.LeagueAthleteResponse;
      leagueId: string;
    }[]
  ) => {
    const athletes: Prisma.AthleteCreateInput[] = [];
    const positions: Prisma.PositionCreateInput[] = [];

    leagueAthleteResponse.forEach((sr) => {
      const { leagueAthlete, position } = createLeagueAthlete(
        sr.athlete,
        sr.leagueId
      );
      athletes.push(leagueAthlete);
      if (position) {
        positions.push(position);
      }
    });

    return { athletes, positions };
  },
  handleGameSummaryResponse: async (
    gameSummaryResponse: {
      gameSummary: EspnApiV2.GameSummaryResponse;
      game: ListAllNflGamesResponse;
    }[],
    athletes: Athlete[]
  ) => {
    return Promise.all(
      gameSummaryResponse.map(async (gsr) => {
        const gameStatistic = await createGameStatistic(gsr);

        const teamGameStatistics = await createTeamGameStatistics(
          gsr.gameSummary.boxscore,
          gsr.game,
          gameStatistic.id
        );
        const athleteGameStatistics = await createAthleteGameStatistics(
          gsr.gameSummary.boxscore,
          gsr.game,
          gameStatistic.id,
          athletes
        );

        if (gsr.game.isComplete && !gsr.game.Statistics?.isComplete) {
          await updateGameStatisticsIsComplete(gameStatistic.id);
        }
        return { teamGameStatistics, gameStatistic, athleteGameStatistics };
      })
    );
  },
};
