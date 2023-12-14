import axios from "axios";
import { EspnApiV2 } from "../types/EspnApiV2/espnApiV2";

const baseUrl = "https://site.api.espn.com/apis/site/v2/sports";
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
      const response = await axios.get<EspnApiV2.SportTeamsListResponse>(url);
      return response.data;
    } catch (err) {
      throw { ...err, espnApiRequestError: true } as EspnError;
    }
  },
  // buildTeamScheduleRequest: async (
  //   sport: string,
  //   slug: string,
  //   teamId: string
  // ) => {
  //   const url = `${baseUrl}/${sport}/${slug}/teams/${teamId}/schedule`;
  //   try {
  //     const response = await axios.get<EspnApiV2.Team>(url);
  //     return response.data;
  //   } catch (err) {
  //     throw { ...err, espnApiRequestError: true } as EspnError;
  //   }
  // },
};
