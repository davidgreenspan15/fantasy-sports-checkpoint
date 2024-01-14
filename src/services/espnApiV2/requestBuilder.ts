import axios from "axios";
import { EspnApiV2 } from "../../types/EspnApiV2/espnApiV2";

const baseUrl = "https://site.api.espn.com/apis/site/v2/sports";
const coreBaseUrl = "https://sports.core.api.espn.com/v2/sports";
export interface EspnError {
  code: number;
  message: string;
  espnApiRequestError: boolean;
}

export const isEspnApiRequestError = (err: any): err is EspnError => {
  return !!err["espnApiRequestError"];
};

export const espnRequestBuilder = {
  buildSportsTeamsListRequest: async (sport: string, slug: string) => {
    const url = `${baseUrl}/${sport}/${slug}/teams`;
    try {
      const response = await axios.get<EspnApiV2.TeamListResponse>(url);
      return response.data;
    } catch (err) {
      throw { ...err, espnApiRequestError: true } as EspnError;
    }
  },
  buildTeamScheduleRequest: async (
    sport: string,
    slug: string,
    teamId: string
  ) => {
    const url = `${baseUrl}/${sport}/${slug}/teams/${teamId}/schedule`;
    try {
      const response = await axios.get<EspnApiV2.TeamScheduleResponse>(url);
      return response.data;
    } catch (err) {
      throw { ...err, espnApiRequestError: true } as EspnError;
    }
  },
  buildTeamRosterRequest: async (
    sport: string,
    slug: string,
    teamId: string
  ) => {
    const url = `${baseUrl}/${sport}/${slug}/teams/${teamId}/roster`;
    try {
      const response = await axios.get<EspnApiV2.TeamRosterResponse>(url);
      return response.data;
    } catch (err) {
      throw { ...err, espnApiRequestError: true } as EspnError;
    }
  },
  buildTeamDepthsRequest: async (
    sport: string,
    slug: string,
    teamId: string
  ) => {
    const url = `${coreBaseUrl}/${sport}/leagues/${slug}/seasons/2023/teams/${teamId}/depthcharts`;
    try {
      const response = await axios.get<EspnApiV2.TeamDepthChartResponse>(url);
      return response.data;
    } catch (err) {
      throw { ...err, espnApiRequestError: true } as EspnError;
    }
  },
  buildAthleteUrlListRequest: async (sport: string, slug: string) => {
    try {
      let pageCount =
        await espnRequestBuilder.buildAthleteUrlListPageCountRequest(
          sport,
          slug
        );
      const pageArray = [];
      while (pageCount > 0) {
        pageArray.unshift(pageCount);
        pageCount--;
      }

      const athleteUrlListResponse: EspnApiV2.LeagueAthleteUrlListResponse[] =
        await Promise.all(
          pageArray.map(async (p) => {
            const url = `${coreBaseUrl}/${sport}/leagues/${slug}/athletes?limit=1000&active=true&page=${p}`;
            try {
              const response =
                await axios.get<EspnApiV2.LeagueAthleteUrlListResponse>(url);
              return response.data;
            } catch (err) {
              throw { ...err, espnApiRequestError: true } as EspnError;
            }
          })
        );
      return athleteUrlListResponse;
    } catch (err) {
      throw { ...err, espnApiRequestError: true } as EspnError;
    }
  },
  buildAthleteUrlListPageCountRequest: async (sport: string, slug: string) => {
    const url = `${coreBaseUrl}/${sport}/leagues/${slug}/athletes?limit=1000&active=true&page=1`;
    try {
      const response = await axios.get<EspnApiV2.LeagueAthleteUrlListResponse>(
        url
      );
      return response.data.pageCount;
    } catch (err) {
      throw { ...err, espnApiRequestError: true } as EspnError;
    }
  },
  buildLeagueAthleteRequest: async (url: string) => {
    try {
      const response = await axios.get<EspnApiV2.LeagueAthleteResponse>(url);
      return response.data;
    } catch (err) {
      throw { ...err, espnApiRequestError: true } as EspnError;
    }
  },
  buildGameSummaryRequest: async (
    sport: string,
    slug: string,
    espnEventId: string
  ) => {
    const url = `${baseUrl}/${sport}/${slug}/summary?event=${espnEventId}`;
    try {
      const response = await axios.get<EspnApiV2.GameSummaryResponse>(url);
      return response.data;
    } catch (err) {
      throw { ...err, espnApiRequestError: true } as EspnError;
    }
  },
};
