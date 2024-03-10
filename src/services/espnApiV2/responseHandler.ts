import { Athlete, Prisma, Roster, Team } from "@prisma/client";

import { EspnApiV2 } from "../../types/EspnApiV2/espnApiV2";
import { ListAllNflGamesResponse } from "../../types/games";
import {
  createAthleteGameStatistics,
  createConference,
  createDepth,
  createDivision,
  createGame,
  createGameStatistic,
  createLeagueAthlete,
  createPosition,
  createTeam,
  createTeamAthlete,
  createTeamGameStatistics,
  isGameComplete,
  mapIdenticalGames,
  mapIdenticalYearlyGames,
  subtractFromTwentyMinutes,
} from "./responseHandlerHelpers";
import { updateGameStatisticsIsComplete } from "../../models/GameStatistics";
import { upsertRosters } from "../../models/rosters";
import { updateGameStatus } from "../../models/games";

export const espnResponseHandler = {
  handleGroupsResponse: (
    leagueGroupsResponse: {
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
    }[]
  ) => {
    const conferences: Prisma.ConferenceCreateInput[] = [];
    const divisions: Prisma.DivisionCreateInput[] = [];
    const teamDivisions: {
      divisionId: string;
      leagueId: string;
      teamId: string;
    }[] = [];

    leagueGroupsResponse.forEach((lg) => {
      lg.conferences.forEach((c) => {
        const conference = createConference(c, lg.leagueId);
        conferences.push(conference);
      });
      lg.divisions.forEach((d) => {
        d.resp.forEach((r) => {
          const division = createDivision(
            r.division,
            lg.leagueId,
            d.conferenceId
          );
          divisions.push(division);
        });
      });
      lg.divisions.forEach((d) => {
        d.resp.forEach((r) => {
          r.divisionTeams.forEach((dt) => {
            const teamDivision = {
              divisionId: r.division.id,
              leagueId: lg.leagueId,
              teamId: dt.teamId,
            };
            teamDivisions.push(teamDivision);
          });
        });
      });
    });

    return { conferences, divisions, teamDivisions };
  },

  handleTeamToConnectToDivisionsResponse: (
    teamsToConnectToDivision: EspnApiV2.ResponseCoreList.Item[],
    divisionId: string,
    leagueId: string
  ) => {
    return Object.values(
      teamsToConnectToDivision.reduce((acc, t) => {
        const refSplit = t.$ref.split("/");
        const teamId = refSplit[refSplit.length - 1].split("?")[0];
        if (!acc[`${divisionId}_${leagueId}_${teamId}`]) {
          acc[`${divisionId}_${leagueId}_${teamId}`] = {
            divisionId: divisionId,
            leagueId: leagueId,
            teamId,
          };
        } else {
          acc[`${divisionId}_${leagueId}_${teamId}`] = {
            divisionId: divisionId,
            leagueId: leagueId,
            teamId,
          };
        }

        return acc;
      }, {} as { [key: string]: { divisionId: string; leagueId: string; teamId: string } })
    );
  },
  handlePositionsResponse: (
    leaguePositionsResponse: {
      positions: EspnApiV2.PositionResponse[];
      leagueId: string;
    }[]
  ) => {
    const positions: Prisma.PositionCreateInput[] = [];
    leaguePositionsResponse.forEach((lp) => {
      lp.positions.forEach((p) => {
        const position: Prisma.PositionCreateInput = createPosition(
          p,
          lp.leagueId
        );
        positions.push(position);
      });
    });

    return positions;
  },

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
      const game = createGame(g.event, g.leagueId, g.homeTeamId, g.awayTeamId);
      games.push(game);
    });
    // Connect Identical Games
    return games;
  },
  handleTeamRosterResponse: async (
    rosterResponse: {
      roster: EspnApiV2.TeamRosterResponse;
      teamId: string;
      leagueId: string;
    }[]
  ) => {
    const teamAthletes: Prisma.AthleteCreateInput[] = [];
    const savedTeamRosters: Roster[] = [];
    await Promise.all(
      rosterResponse.map(async (sr) => {
        const teamRoster: Prisma.RosterCreateInput = {
          Team: { connect: { id: sr.teamId } },
          League: { connect: { id: sr.leagueId } },
          Season: {
            connectOrCreate: {
              where: {
                displayYear_type: {
                  displayYear: sr.roster.season.displayName,
                  type: sr.roster.season.type,
                },
              },
              create: {
                type: sr.roster.season.type,
                name: sr.roster.season.name,
                displayYear: sr.roster.season.displayName,
              },
            },
          },
          seasonYearDisplayNumberAndType: `${sr.roster.season.displayName}_${sr.roster.season.type}`,
        };
        const savedTeamRoster = await upsertRosters(teamRoster);
        sr.roster.athletes.forEach((a) => {
          if (!a.items && a.guid) {
            a["items"] = sr.roster
              .athletes as EspnApiV2.ResponseTeamRoster.Item[];
          }
          a.items?.forEach((i) => {
            const { teamAthlete } = createTeamAthlete(
              i,
              sr.teamId,
              sr.leagueId,
              savedTeamRoster?.id
            );
            teamAthletes.push(teamAthlete);
          });
        });
        savedTeamRosters.push(savedTeamRoster);
      })
    );
    return {
      teamAthletes,
      savedTeamRosters,
    };
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
        imageUrl?: string;
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

    leagueAthleteResponse.forEach((sr) => {
      const { leagueAthlete } = createLeagueAthlete(sr.athlete, sr.leagueId);
      athletes.push(leagueAthlete);
    });

    return { athletes };
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
        const drives = gsr.gameSummary.drives;
        const plays =
          (drives?.previous || drives?.current)?.flatMap((d) => {
            return d.plays;
          }) || gsr.gameSummary.plays;

        if (plays?.length > 0) {
          const lastPlay = plays[plays.length - 1];
          const isComplete = isGameComplete(plays, gsr.game.League.slug);

          let timeOnClock = lastPlay?.clock?.displayValue;

          if (gsr.game.League.slug === "mlb") {
            timeOnClock = lastPlay.period.type;
          }
          if (gsr.game.League.slug === "nhl") {
            timeOnClock = subtractFromTwentyMinutes(timeOnClock);
          }
          const updatedGame = await updateGameStatus(
            gsr.game.id,
            timeOnClock,
            lastPlay?.period.number,
            isComplete
          );
          gsr.game = {
            ...gsr.game,
            ...updatedGame,
          };

          const gameStatistic = await createGameStatistic(gsr);

          const teamGameStatistics = await createTeamGameStatistics(
            gsr.gameSummary.boxscore,
            gsr.game,
            gameStatistic.id,
            plays[plays.length - 1]
          );
          const athleteGameStatistics = await createAthleteGameStatistics(
            gsr.gameSummary.boxscore,
            gsr.game,
            gameStatistic.id,
            athletes
          );
          if (gsr.game.isComplete) {
            if (!gsr.game.Statistics?.isComplete) {
              await updateGameStatisticsIsComplete(gameStatistic.id);
            }
          }

          return { teamGameStatistics, gameStatistic, athleteGameStatistics };
        }
      })
    );
  },
  handleLeagueYearlyScheduleResponse: (
    leagueYearlyScheduleResponse: EspnApiV2.LeagueYearlyScheduleResponse,
    teams: Team[]
  ) => {
    const games: Prisma.GameCreateInput[] = [];
    const uniqueGames = mapIdenticalYearlyGames(
      leagueYearlyScheduleResponse,
      teams
    );
    uniqueGames.forEach((g) => {
      const game = createGame(g.event, g.leagueId, g.homeTeamId, g.awayTeamId);
      games.push(game);
    });

    return games;
  },
};
