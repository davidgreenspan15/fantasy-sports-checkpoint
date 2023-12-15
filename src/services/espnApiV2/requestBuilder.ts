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
};
