import { JsonValue } from "@prisma/client/runtime/library";
import { EspnApiV2 } from "./EspnApiV2/espnApiV2";

export interface ListAllNflGamesResponse {
  id: string;
  espnId: string;
  isComplete: boolean;
  awayTeamId: string;
  homeTeamId: string;

  League: {
    id: string;
    slug: string;
    sport: string;
  };
  HomeTeam: {
    id: string;
    espnId: string;
  };
  AwayTeam: {
    id: string;
    espnId: string;
  };
  Statistics: {
    id: string;
    isComplete: boolean;
    jsonPayload: JsonValue | EspnApiV2.GameSummaryResponse;
  };
}
