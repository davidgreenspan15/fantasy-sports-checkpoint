export interface ListAllNflGamesResponse {
  id: string;
  espnId: string;
  League: {
    id: string;
    slug: string;
    sport: string;
  };
  Teams: {
    id: string;
    espnId: string;
  }[];
  Statistics: {
    id: string;
    TeamGameStatistics: {
      id: string;
      NflStatistic: {
        id: string;
        AthleteTotalStatistics: {
          id: string;
          PassingStatistics: {
            id: string;
          };
          RushingStatistics: {
            id: string;
          };
          ReceivingStatistics: {
            id: string;
          };
          KickingStatistics: {
            id: string;
          };
          PuntingStatistics: {
            id: string;
          };
          KickReturnStatistics: {
            id: string;
          };
          PuntReturnStatistics: {
            id: string;
          };
          DefensiveStatistics: {
            id: string;
          };
          FumbleStatistics: {
            id: string;
          };
          InterceptionStatistics: {
            id: string;
          };
        };
      };
    }[];
    AthleteGameStatistics: {
      id: string;
      NflStatistic: {
        id: string;
        PassingStatistics: {
          id: string;
        };
        RushingStatistics: {
          id: string;
        };
        ReceivingStatistics: {
          id: string;
        };
        KickingStatistics: {
          id: string;
        };
        PuntingStatistics: {
          id: string;
        };
        KickReturnStatistics: {
          id: string;
        };
        PuntReturnStatistics: {
          id: string;
        };
        DefensiveStatistics: {
          id: string;
        };
        FumbleStatistics: {
          id: string;
        };
        InterceptionStatistics: {
          id: string;
        };
      };
    }[];
  };
}
