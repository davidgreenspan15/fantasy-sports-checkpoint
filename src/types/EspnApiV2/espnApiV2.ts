export namespace EspnApiV2 {
  export type TeamListResponse = ResponseTeamList.SportTeam;

  export type TeamScheduleResponse = ResponseTeamSchedule.Schedule;

  export type TeamRosterResponse = ResponseTeamRoster.Roster;

  export type LeagueAthleteUrlListResponse =
    ResponseLeagueAthleteUrlList.AthleteUrl;

  export type TeamDepthChartResponse = ResponseTeamDepthChart.DepthChart;

  export type LeagueAthleteResponse = ResponseLeagueAthlete.Athlete;

  export type GameSummaryResponse = ResponseGameSummary.GameSummary;

  export type LeagueYearlyScheduleResponse =
    ResponseLeagueYearlySchedule.LeagueYearlySchedule;
  export namespace ResponseTeamList {
    export interface SportTeam {
      sports: Sport[];
    }
    export interface Sport {
      id: string;
      uid: string;
      name: string;
      slug: string;
      leagues: League[];
    }

    export interface League {
      id: string;
      uid: string;
      name: string;
      abbreviation: string;
      shortName: string;
      slug: string;
      teams: TeamElement[];
      year: number;
      season: Season;
    }

    export interface Season {
      year: number;
      displayName: string;
    }

    export interface TeamElement {
      team: TeamTeam;
    }

    export interface TeamTeam {
      id: string;
      uid: string;
      slug: string;
      abbreviation: string;
      displayName: string;
      shortDisplayName: string;
      name: string;
      nickname: string;
      location: string;
      color: string;
      alternateColor: string;
      isActive: boolean;
      isAllStar: boolean;
      logos: Logo[];
      links: Link[];
    }

    export interface Link {
      language: Language;
      rel: LinkRel[];
      href: string;
      text: Text;
      shortText: Text;
      isExternal: boolean;
      isPremium: boolean;
      isHidden: boolean;
    }

    export enum Language {
      EnUS = "en-US",
    }

    export enum LinkRel {
      Clubhouse = "clubhouse",
      Depthchart = "depthchart",
      Desktop = "desktop",
      Roster = "roster",
      Schedule = "schedule",
      Stats = "stats",
      Team = "team",
      Tickets = "tickets",
    }

    export enum Text {
      Clubhouse = "Clubhouse",
      DepthChart = "Depth Chart",
      Roster = "Roster",
      Schedule = "Schedule",
      Statistics = "Statistics",
      Tickets = "Tickets",
    }

    export interface Logo {
      href: string;
      alt: string;
      rel: LogoRel[];
      width: number;
      height: number;
    }

    export enum LogoRel {
      Dark = "dark",
      Default = "default",
      Full = "full",
      Scoreboard = "scoreboard",
    }
  }

  export namespace ResponseTeamSchedule {
    export interface Schedule {
      timestamp: string;
      status: string;
      season: RequestedSeasonClass;
      team: Team;
      events: Event[];
      requestedSeason: RequestedSeasonClass;
      byeWeek: number;
    }
    export interface Event {
      id: string;
      date: string;
      name: string;
      shortName: string;
      season: EventSeason;
      seasonType: SeasonType;
      week: Week;
      timeValid: boolean;
      competitions: Competition[];
      links: EventLink[];
    }

    export interface Competition {
      id: string;
      date: string;
      attendance: number;
      type: CompetitionType;
      timeValid: boolean;
      neutralSite: boolean;
      boxscoreAvailable: boolean;
      ticketsAvailable: boolean;
      venue: Venue;
      competitors: Competitor[];
      notes: any[];
      broadcasts: Broadcast[];
      status: Status;
      tickets?: Ticket[];
    }

    export interface Broadcast {
      type: BroadcastType;
      market: Market;
      media: Media;
      lang: Lang;
      region: Region;
    }

    export enum Lang {
      En = "en",
    }

    export interface Market {
      id: string;
      type: MarketType;
    }

    export enum MarketType {
      National = "National",
    }

    export interface Media {
      shortName: MediaShortName;
    }

    export enum MediaShortName {
      Cbs = "CBS",
      Fox = "FOX",
    }

    export enum Region {
      Us = "us",
    }

    export interface BroadcastType {
      id: string;
      shortName: TypeShortName;
    }

    export enum TypeShortName {
      Tv = "TV",
    }

    export interface Competitor {
      id: string;
      type: TypeElement;
      order: number;
      homeAway: HomeAway;
      winner?: boolean;
      team: CompetitorTeam;
      score?: Score;
      record?: Record[];
      leaders?: CompetitorLeader[];
    }

    export enum HomeAway {
      Away = "away",
      Home = "home",
    }

    export interface CompetitorLeader {
      name: LeaderName;
      displayName: LeaderDisplayName;
      abbreviation: LeaderAbbreviation;
      leaders: LeaderLeader[];
    }

    export enum LeaderAbbreviation {
      Pyds = "PYDS",
      Recyds = "RECYDS",
      Ryds = "RYDS",
    }

    export enum LeaderDisplayName {
      PassingLeader = "Passing Leader",
      ReceivingLeader = "Receiving Leader",
      RushingLeader = "Rushing Leader",
    }

    export interface LeaderLeader {
      displayValue: string;
      value: number;
      athlete: Athlete;
    }

    export interface Athlete {
      id: string;
      lastName: string;
      displayName: string;
      shortName: string;
      links: AthleteLink[];
    }

    export interface AthleteLink {
      rel: PurpleRel[];
      href: string;
    }

    export enum PurpleRel {
      Athlete = "athlete",
      Bio = "bio",
      Desktop = "desktop",
      Event = "event",
      Gamelog = "gamelog",
      News = "news",
      Overview = "overview",
      Playercard = "playercard",
      Splits = "splits",
      Stats = "stats",
      Tickets = "tickets",
      Venue = "venue",
    }

    export enum LeaderName {
      PassingLeader = "passingLeader",
      ReceivingLeader = "receivingLeader",
      RushingLeader = "rushingLeader",
    }

    export interface Record {
      id: string;
      abbreviation?: RecordAbbreviation;
      displayName: RecordDisplayName;
      shortDisplayName: ShortDisplayName;
      description: RecordDescription;
      type: RecordType;
      displayValue: string;
    }

    export enum RecordAbbreviation {
      Game = "Game",
    }

    export enum RecordDescription {
      AwayRecord = "Away Record",
      HomeRecord = "Home Record",
      OverallRecord = "Overall Record",
    }

    export enum RecordDisplayName {
      Home = "Home",
      RecordYearToDate = "Record Year To Date",
      Road = "Road",
    }

    export enum ShortDisplayName {
      Away = "AWAY",
      Home = "HOME",
      Ytd = "YTD",
    }

    export enum RecordType {
      Home = "home",
      Road = "road",
      Total = "total",
    }

    export interface Score {
      value: number;
      displayValue: string;
    }

    export interface CompetitorTeam {
      id: string;
      location: string;
      nickname: string;
      abbreviation: string;
      displayName: string;
      shortDisplayName: string;
      logos: Logo[];
      links: TeamLink[];
    }

    export interface TeamLink {
      rel: TypeElement[];
      href: string;
      text: PurpleText;
    }

    export enum TypeElement {
      Clubhouse = "clubhouse",
      Depthchart = "depthchart",
      Desktop = "desktop",
      Draftpicks = "draftpicks",
      Injuries = "injuries",
      Photos = "photos",
      Roster = "roster",
      Schedule = "schedule",
      Stats = "stats",
      Team = "team",
      Tickets = "tickets",
      Transactions = "transactions",
    }

    export enum PurpleText {
      Clubhouse = "Clubhouse",
      DepthChart = "Depth Chart",
      DraftPicks = "Draft Picks",
      Injuries = "Injuries",
      Photos = "photos",
      Roster = "Roster",
      Schedule = "Schedule",
      Statistics = "Statistics",
      Tickets = "Tickets",
      Transactions = "Transactions",
    }

    export interface Logo {
      href: string;
      width: number;
      height: number;
      alt: string;
      rel: LogoRel[];
      lastUpdated: string;
    }

    export enum LogoRel {
      Dark = "dark",
      Default = "default",
      Full = "full",
      Scoreboard = "scoreboard",
    }

    export interface Status {
      clock: number;
      displayClock: DisplayClock;
      period: number;
      type: StatusType;
    }

    export enum DisplayClock {
      The000 = "0:00",
    }

    export interface StatusType {
      id: string;
      name: TypeName;
      state: State;
      completed: boolean;
      description: TypeDescription;
      detail: string;
      shortDetail: string;
    }

    export enum TypeDescription {
      Final = "Final",
      Scheduled = "Scheduled",
    }

    export enum TypeName {
      StatusFinal = "STATUS_FINAL",
      StatusScheduled = "STATUS_SCHEDULED",
    }

    export enum State {
      Post = "post",
      Pre = "pre",
    }

    export interface Ticket {
      id: string;
      summary: string;
      description: string;
      maxPrice: number;
      startingPrice: number;
      numberAvailable: number;
      totalPostings: number;
      links: AthleteLink[];
    }

    export interface CompetitionType {
      id: string;
      text: TypeText;
      abbreviation: TypeAbbreviation;
      slug: Slug;
      type: Slug;
    }

    export enum TypeAbbreviation {
      Std = "STD",
    }

    export enum Slug {
      Standard = "standard",
    }

    export enum TypeText {
      Standard = "Standard",
    }

    export interface Venue {
      fullName: string;
      address: Address;
    }

    export interface Address {
      city: string;
      state: string;
      zipCode: string;
    }

    export interface EventLink {
      language: Language;
      rel: FluffyRel[];
      href: string;
      text: ShortTextEnum;
      shortText: ShortTextEnum;
      isExternal: boolean;
      isPremium: boolean;
    }

    export enum Language {
      EnUS = "en-US",
    }

    export enum FluffyRel {
      App = "app",
      Boxscore = "boxscore",
      Desktop = "desktop",
      Event = "event",
      Gamecast = "gamecast",
      Mobile = "mobile",
      Now = "now",
      Pbp = "pbp",
      Recap = "recap",
      Sportscenter = "sportscenter",
      Summary = "summary",
      Teamstats = "teamstats",
      Videos = "videos",
    }

    export enum ShortTextEnum {
      BoxScore = "Box Score",
      Gamecast = "Gamecast",
      Now = "Now",
      PlayByPlay = "Play-by-Play",
      Recap = "Recap",
      Summary = "Summary",
      TeamStats = "Team Stats",
      Videos = "Videos",
    }

    export interface EventSeason {
      year: number;
      displayName: string;
    }

    export interface SeasonType {
      id: string;
      type: number;
      name: SeasonTypeName;
      abbreviation: SeasonTypeAbbreviation;
    }

    export enum SeasonTypeAbbreviation {
      Reg = "reg",
    }

    export enum SeasonTypeName {
      RegularSeason = "Regular Season",
    }

    export interface Week {
      number: number;
      text: string;
    }

    export interface RequestedSeasonClass {
      year: number;
      type: number;
      name: SeasonTypeName;
      displayName: string;
      half?: number;
    }

    export interface Team {
      id: string;
      abbreviation: string;
      location: string;
      name: string;
      displayName: string;
      clubhouse: string;
      color: string;
      logo: string;
      recordSummary: string;
      seasonSummary: string;
      standingSummary: string;
      groups: Groups;
    }

    export interface Groups {
      id: string;
      parent: Parent;
      isConference: boolean;
    }

    export interface Parent {
      id: string;
    }
  }

  export namespace ResponseTeamRoster {
    export interface Roster {
      timestamp: string;
      status: string;
      season: Season;
      athletes: Athlete[];
      coach: Coach[];
      team: Team;
    }

    export interface Athlete {
      position: string;
      items: Item[];
    }

    export interface Item {
      id: string;
      uid: string;
      guid: string;
      alternateIds: AlternateIDS;
      firstName: string;
      lastName: string;
      fullName: string;
      displayName: string;
      shortName: string;
      weight: number;
      displayWeight: string;
      height: number;
      displayHeight: string;
      age: number;
      dateOfBirth: string;
      links: Link[];
      birthPlace: BirthPlace;
      college?: College;
      slug: string;
      headshot: Headshot;
      jersey: string;
      position: Position;
      injuries: Injury[];
      teams?: TeamElement[];
      contracts: any[];
      experience: Experience;
      status: StatusClass;
      debutYear?: number;
      hand?: Hand;
    }

    export interface AlternateIDS {
      sdr: string;
    }

    export interface BirthPlace {
      city?: string;
      state?: string;
      country?: Country;
    }

    export enum Country {
      Austria = "Austria",
      Canada = "Canada",
      Denmark = "Denmark",
      Usa = "USA",
    }

    export interface College {
      id: string;
      mascot: string;
      name: string;
      shortName: string;
      abbrev?: string;
    }

    export interface Experience {
      years: number;
    }

    export interface Hand {
      type: string;
      abbreviation: string;
      displayValue: string;
    }

    export interface Headshot {
      href: string;
      alt: string;
    }

    export interface Injury {
      status: StatusEnum;
      date: string;
    }

    export enum StatusEnum {
      InjuredReserve = "Injured Reserve",
      Out = "Out",
      Questionable = "Questionable",
    }

    export interface Link {
      language: Language;
      rel: Rel[];
      href: string;
      text: Text;
      shortText: Text;
      isExternal: boolean;
      isPremium: boolean;
    }

    export enum Language {
      EnUS = "en-US",
    }

    export enum Rel {
      Athlete = "athlete",
      Bio = "bio",
      Desktop = "desktop",
      Gamelog = "gamelog",
      News = "news",
      Overview = "overview",
      Playercard = "playercard",
      Splits = "splits",
      Stats = "stats",
    }

    export enum Text {
      Bio = "Bio",
      GameLog = "Game Log",
      News = "News",
      Overview = "Overview",
      PlayerCard = "Player Card",
      Splits = "Splits",
      Stats = "Stats",
    }

    export interface Position {
      id: string;
      name: string;
      displayName: string;
      abbreviation: string;
      leaf: boolean;
      parent?: Position;
    }

    export interface StatusClass {
      id: string;
      name: Abbreviation;
      type: Type;
      abbreviation: Abbreviation;
    }

    export enum Abbreviation {
      Active = "Active",
      DayToDay = "Day-To-Day",
      PracticeSquad = "Practice Squad",
    }

    export enum Type {
      Active = "active",
      DayToDay = "day-to-day",
      PracticeSquad = "practice-squad",
    }

    export interface TeamElement {
      $ref: string;
    }

    export interface Coach {
      id: string;
      firstName: string;
      lastName: string;
      experience: number;
    }

    export interface Season {
      year: number;
      displayName: string;
      type: number;
      name: string;
    }

    export interface Team {
      id: string;
      abbreviation: string;
      location: string;
      name: string;
      displayName: string;
      clubhouse: string;
      color: string;
      logo: string;
      recordSummary: string;
      seasonSummary: string;
      standingSummary: string;
    }
  }

  export namespace ResponseTeamDepthChart {
    export interface DepthChart {
      count: number;
      pageIndex: number;
      pageSize: number;
      pageCount: number;
      items: Item[];
    }

    export interface Item {
      id: string;
      name: string;
      positions: { [key: string]: PositionValue };
    }

    export interface PositionValue {
      position: PositionPosition;
      athletes: Athlete[];
    }

    export interface Athlete {
      slot: number;
      athlete: Parent;
      rank: number;
    }

    export interface Parent {
      $ref: string;
    }

    export interface PositionPosition {
      $ref: string;
      id: string;
      name: string;
      displayName: string;
      abbreviation: string;
      leaf: boolean;
      parent: Parent;
    }
  }

  export namespace ResponseLeagueAthleteUrlList {
    export interface AthleteUrl {
      count: number;
      pageIndex: number;
      pageSize: number;
      pageCount: number;
      items: Item[];
    }

    export interface Item {
      $ref: string;
    }
  }

  export namespace ResponseLeagueAthlete {
    export interface Athlete {
      $ref: string;
      id: string;
      uid: string;
      guid: string;
      type: string;
      alternateIds: AlternateIDS;
      firstName: string;
      lastName: string;
      fullName: string;
      displayName: string;
      shortName: string;
      weight: number;
      displayWeight: string;
      height: number;
      displayHeight: string;
      age: number;
      dateOfBirth: string;
      links: Link[];
      birthPlace: BirthPlace;
      college: College;
      slug: string;
      headshot: Headshot;
      jersey: string;
      position: Position;
      linked: boolean;
      team: College;
      statistics: College;
      contracts: College;
      experience: Experience;
      collegeAthlete: College;
      active: boolean;
      status: Status;
      statisticslog: College;
    }

    export interface AlternateIDS {
      sdr: string;
    }

    export interface BirthPlace {
      city: string;
      state: string;
      country: string;
    }

    export interface College {
      $ref: string;
    }

    export interface Experience {
      years: number;
    }

    export interface Headshot {
      href: string;
      alt: string;
    }

    export interface Link {
      language: string;
      rel: string[];
      href: string;
      text: string;
      shortText: string;
      isExternal: boolean;
      isPremium: boolean;
    }

    export interface Position {
      $ref: string;
      id: string;
      name: string;
      displayName: string;
      abbreviation: string;
      leaf: boolean;
      parent: College;
    }

    export interface Status {
      id: string;
      name: string;
      type: string;
      abbreviation: string;
    }
  }
  export namespace ResponseGameSummary {
    export interface GameSummary {
      boxscore: Boxscore;
      format: Format;
      gameInfo: GameInfo;
      drives: Drives;
      leaders: Leader[];
      broadcasts: any[];
      predictor: Predictor;
      pickcenter: Pickcenter[];
      againstTheSpread: AgainstTheSpread[];
      odds: any[];
      winprobability: Winprobability[];
      scoringPlays: ScoringPlay[];
      header: Header;
      news: News;
      article: Article;
      videos: any[];
      standings: Standing;
      plays: Play[];
    }

    export interface AgainstTheSpread {
      team: AgainstTheSpreadTeam;
      records: any[];
    }

    export interface AgainstTheSpreadTeam {
      id: string;
      uid: Uid;
      displayName: TeamDisplayName;
      abbreviation: TeamAbbreviation;
      links: FullViewLinkElement[];
      logo: string;
      logos: LogoElement[];
    }

    export enum TeamAbbreviation {
      Atl = "ATL",
      Phi = "PHI",
    }

    export enum TeamDisplayName {
      AtlantaFalcons = "Atlanta Falcons",
      PhiladelphiaEagles = "Philadelphia Eagles",
    }

    export interface FullViewLinkElement {
      href: string;
      text: Text;
    }

    export enum Text {
      Clubhouse = "Clubhouse",
      FullStandings = "Full Standings",
      Schedule = "Schedule",
    }

    export interface LogoElement {
      href: string;
      width: number;
      height: number;
      alt: string;
      rel: BoxscoreSource[];
      lastUpdated?: LastUpdated;
    }

    export enum LastUpdated {
      The20180605T1211Z = "2018-06-05T12:11Z",
      The20220202T1351Z = "2022-02-02T13:51Z",
      The20220202T1358Z = "2022-02-02T13:58Z",
      The20230824T1926Z = "2023-08-24T19:26Z",
      The20230824T1927Z = "2023-08-24T19:27Z",
      The20230824T1928Z = "2023-08-24T19:28Z",
    }

    export enum BoxscoreSource {
      Dark = "dark",
      Day = "day",
      Default = "default",
      Full = "full",
      Interior = "interior",
      Scoreboard = "scoreboard",
    }

    export enum Uid {
      S20L28T1 = "s:20~l:28~t:1",
      S20L28T21 = "s:20~l:28~t:21",
    }

    export interface Article {
      keywords: any[];
      description: string;
      source: string;
      video: any[];
      type: string;
      nowId: string;
      premium: boolean;
      related: any[];
      allowSearch: boolean;
      links: PurpleLinks;
      id: number;
      categories: PurpleCategory[];
      headline: string;
      gameId: string;
      images: any[];
      linkText: string;
      published: string;
      allowComments: boolean;
      lastModified: string;
      metrics: Metric[];
      inlines: any[];
      story: string;
    }

    export interface PurpleCategory {
      id: number;
      description: string;
      type: CategoryType;
      sportId: number;
      leagueId?: number;
      league?: CategoryLeague;
      uid: string;
      teamId?: number;
      team?: CategoryTeam;
    }

    export interface CategoryLeague {
      id: number;
      description: string;
      links: LeagueLinks;
    }

    export interface LeagueLinks {
      api: PurpleAPI;
      web: PurpleAPI;
      mobile: PurpleAPI;
    }

    export interface PurpleAPI {
      leagues: Mobile;
    }

    export interface Mobile {
      href?: string;
    }

    export interface CategoryTeam {
      id: number;
      description: string;
      links: TeamLinks;
    }

    export interface TeamLinks {
      api: FluffyAPI;
      web: FluffyAPI;
      mobile: FluffyAPI;
    }

    export interface FluffyAPI {
      teams: Mobile;
    }

    export enum CategoryType {
      Athlete = "athlete",
      GUID = "guid",
      League = "league",
      Team = "team",
      Topic = "topic",
    }

    export interface PurpleLinks {
      api: TentacledAPI;
      web: Mobile;
      app: App;
      mobile: Mobile;
    }

    export interface TentacledAPI {
      news: Mobile;
      events: Mobile;
    }

    export interface App {
      sportscenter: Mobile;
    }

    export interface Metric {
      count: number;
      type: string;
    }

    export interface Boxscore {
      teams: TeamElement[];
      players: Player[];
    }

    export interface Player {
      team: PlayerTeam;
      statistics: PlayerStatistic[];
      displayOrder: number;
    }

    export interface PlayerStatistic {
      name: string;
      keys: string[];
      text: string;
      labels: string[];
      descriptions: string[];
      athletes: AthleteElement[];
      totals: string[];
    }

    export interface AthleteElement {
      athlete: AthleteAthlete;
      stats: string[];
    }

    export interface AthleteAthlete {
      id: string;
      uid: string;
      guid: string;
      firstName: string;
      lastName: string;
      displayName: string;
      links: AthleteLink[];
    }

    export interface AthleteLink {
      rel: string[];
      href: string;
      text: string;
    }

    export interface PlayerTeam {
      id: string;
      uid: Uid;
      slug: string;
      location: string;
      name: NicknameEnum;
      abbreviation: TeamAbbreviation;
      displayName: TeamDisplayName;
      shortDisplayName: NicknameEnum;
      color: string;
      alternateColor: string;
      logo: string;
    }

    export enum NicknameEnum {
      Eagles = "Eagles",
      Falcons = "Falcons",
    }

    export interface TeamElement {
      team: PlayerTeam;
      statistics: TeamStatistic[];
      displayOrder: number;
    }

    export interface TeamStatistic {
      name: string;
      displayValue: string;
      label: string;
    }

    export interface Drives {
      previous: Previous[];
    }

    export interface Previous {
      id: string;
      description: string;
      team: PreviousTeam;
      start: PreviousEnd;
      end: PreviousEnd;
      timeElapsed: TimeElapsed;
      yards: number;
      isScore: boolean;
      offensivePlays: number;
      result: string;
      shortDisplayResult: string;
      displayResult: string;
      plays: Play[];
    }

    export interface PreviousEnd {
      period: EndPeriod;
      clock?: TimeElapsed;
      yardLine: number;
      text: string;
    }

    export interface TimeElapsed {
      displayValue: string;
    }

    export interface EndPeriod {
      type: PeriodType;
      number: number;
    }

    export enum PeriodType {
      Quarter = "quarter",
    }

    export interface Play {
      id: string;
      sequenceNumber: string;
      type: PlayType;
      text: string;
      awayScore: number;
      homeScore: number;
      period: PlayPeriod;
      clock: TimeElapsed;
      scoringPlay: boolean;
      priority: boolean;
      modified: Modified;
      wallclock: string;
      start: PlayEnd;
      end: PlayEnd;
      statYardage: number;
      scoringType?: ScoringType;
    }

    export interface PlayEnd {
      down: number;
      distance: number;
      yardLine: number;
      yardsToEndzone: number;
      downDistanceText?: string;
      shortDownDistanceText?: string;
      possessionText?: string;
      team?: EndTeam;
    }

    export interface EndTeam {
      id: string;
    }

    export enum Modified {
      The20211012T1018Z = "2021-10-12T10:18Z",
    }

    export interface PlayPeriod {
      number: number;
    }

    export interface ScoringType {
      name: ScoringTypeName;
      displayName: ScoringTypeDisplayName;
      abbreviation: ScoringTypeAbbreviation;
    }

    export enum ScoringTypeAbbreviation {
      Eg = "EG",
      Eh = "EH",
      Ep = "EP",
      Fg = "FG",
      K = "K",
      Pen = "PEN",
      Punt = "PUNT",
      Rec = "REC",
      Rush = "RUSH",
      Td = "TD",
      The2MinWarn = "2Min Warn",
      To = "TO",
    }

    export enum ScoringTypeDisplayName {
      FieldGoal = "Field Goal",
      Touchdown = "Touchdown",
    }

    export enum ScoringTypeName {
      FieldGoal = "field-goal",
      Touchdown = "touchdown",
    }

    export interface PlayType {
      id: string;
      text: string;
      abbreviation?: ScoringTypeAbbreviation;
    }

    export interface PreviousTeam {
      name: NicknameEnum;
      abbreviation: TeamAbbreviation;
      displayName: TeamDisplayName;
      shortDisplayName: NicknameEnum;
      logos: LogoElement[];
    }

    export interface Format {
      regulation: Overtime;
      overtime: Overtime;
    }

    export interface Overtime {
      periods: number;
      displayName: string;
      slug: string;
      clock: number;
    }

    export interface GameInfo {
      venue: Venue;
      attendance: number;
    }

    export interface Venue {
      id: string;
      fullName: string;
      address: Address;
      capacity: number;
      grass: boolean;
      images: LogoElement[];
    }

    export interface Address {
      city: string;
      state: string;
      zipCode: string;
    }

    export interface Header {
      id: string;
      uid: string;
      season: Season;
      timeValid: boolean;
      competitions: Competition[];
      links: HeaderLink[];
      week: number;
      league: HeaderLeague;
    }

    export interface Competition {
      id: string;
      uid: string;
      date: string;
      neutralSite: boolean;
      conferenceCompetition: boolean;
      boxscoreAvailable: boolean;
      commentaryAvailable: boolean;
      liveAvailable: boolean;
      onWatchESPN: boolean;
      recent: boolean;
      boxscoreSource: BoxscoreSource;
      playByPlaySource: BoxscoreSource;
      competitors: Competitor[];
      status: Status;
      broadcasts: Broadcast[];
    }

    export interface Broadcast {
      type: BroadcastType;
      market: Market;
      media: Media;
      lang: string;
      region: string;
    }

    export interface Market {
      id: string;
      type: string;
    }

    export interface Media {
      shortName: string;
    }

    export interface BroadcastType {
      id: string;
      shortName: string;
    }

    export interface Competitor {
      id: string;
      uid: Uid;
      order: number;
      homeAway: string;
      winner: boolean;
      team: CompetitorTeam;
      score: string;
      linescores: TimeElapsed[];
      record: Record[];
      possession: boolean;
    }

    export interface Record {
      type: string;
      summary: string;
      displayValue: string;
    }

    export interface CompetitorTeam {
      id: string;
      uid: Uid;
      location: string;
      name: NicknameEnum;
      nickname: NicknameEnum;
      abbreviation: TeamAbbreviation;
      displayName: TeamDisplayName;
      color: string;
      alternateColor: string;
      logos: LogoElement[];
      links: AthleteLink[];
    }

    export interface Status {
      type: StatusType;
    }

    export interface StatusType {
      id: string;
      name: string;
      state: string;
      completed: boolean;
      description: string;
      detail: string;
      shortDetail: string;
    }

    export interface HeaderLeague {
      id: string;
      uid: string;
      name: string;
      abbreviation: string;
      slug: string;
      isTournament: boolean;
      links: AthleteLink[];
    }

    export interface HeaderLink {
      rel: string[];
      href: string;
      text: string;
      shortText: string;
      isExternal: boolean;
      isPremium: boolean;
      language?: string;
    }

    export interface Season {
      year: number;
      type: number;
    }

    export interface Leader {
      team: AgainstTheSpreadTeam;
      leaders: PurpleLeader[];
    }

    export interface PurpleLeader {
      name: string;
      displayName: string;
      leaders: FluffyLeader[];
    }

    export interface FluffyLeader {
      displayValue: string;
      athlete: LeaderAthlete;
    }

    export interface LeaderAthlete {
      id: string;
      uid: string;
      guid: string;
      lastName: string;
      fullName: string;
      displayName: string;
      shortName: string;
      links: AthleteLink[];
      headshot: Headshot;
      jersey: string;
      position: Position;
      team: AthleteTeam;
    }

    export interface Headshot {
      href: string;
      alt: string;
    }

    export interface Position {
      abbreviation: string;
    }

    export interface AthleteTeam {
      $ref: string;
    }

    export interface News {
      header: string;
      link: HeaderLink;
      articles: ArticleElement[];
    }

    export interface ArticleElement {
      images: ArticleImage[];
      dataSourceIdentifier?: string;
      description: string;
      published: string;
      type: string;
      premium: boolean;
      links: FluffyLinks;
      lastModified: string;
      categories: FluffyCategory[];
      headline: string;
      byline?: string;
    }

    export interface FluffyCategory {
      id?: number;
      description?: string;
      type: CategoryType;
      sportId?: number;
      leagueId?: number;
      league?: CategoryLeague;
      uid?: string;
      createDate?: string;
      teamId?: number;
      team?: CategoryTeam;
      athleteId?: number;
      athlete?: CategoryAthlete;
      guid?: string;
      topicId?: number;
    }

    export interface CategoryAthlete {
      id: number;
      description: string;
      links: AthleteLinks;
    }

    export interface AthleteLinks {
      api: StickyAPI;
      web: StickyAPI;
      mobile: StickyAPI;
    }

    export interface StickyAPI {
      athletes: Mobile;
    }

    export interface ArticleImage {
      name: string;
      width: number;
      alt?: string;
      caption?: string;
      url: string;
      height: number;
      dataSourceIdentifier?: string;
      id?: number;
      credit?: string;
      type?: string;
      _id?: number;
    }

    export interface FluffyLinks {
      api: IndigoAPI;
      web: Mobile;
      mobile?: Mobile;
    }

    export interface IndigoAPI {
      news: Mobile;
      self: Mobile;
    }

    export interface Pickcenter {
      provider: Provider;
      details: string;
      overUnder: number;
      spread: number;
      overOdds: number;
      underOdds: number;
      awayTeamOdds: TeamOdds;
      homeTeamOdds: TeamOdds;
      links: any[];
      current: PickcenterCurrent;
    }

    export interface TeamOdds {
      winPercentage?: number;
      favorite: boolean;
      underdog: boolean;
      moneyLine: number;
      spreadOdds: number;
      current: AwayTeamOddsCurrent;
      teamId: string;
      averageScore?: number;
      moneyLineOdds?: number;
      spreadReturn?: number;
      spreadRecord?: SpreadRecord;
    }

    export interface AwayTeamOddsCurrent {
      pointSpread: Over;
      spread: Over;
      moneyLine: Over;
    }

    export interface Over {
      alternateDisplayValue: string;
    }

    export interface SpreadRecord {
      wins: number;
      losses: number;
      pushes: number;
      summary: string;
    }

    export interface PickcenterCurrent {
      over: Over;
      under: Over;
      total: Over;
    }

    export interface Provider {
      id: string;
      name: string;
      priority: number;
    }

    export interface Predictor {
      header: string;
      homeTeam: Team;
      awayTeam: Team;
    }

    export interface Team {
      id: string;
      gameProjection: string;
      teamChanceLoss: string;
      teamChanceTie: string;
    }

    export interface ScoringPlay {
      id: string;
      type: PlayType;
      text: string;
      awayScore: number;
      homeScore: number;
      period: PlayPeriod;
      clock: Clock;
      team: AgainstTheSpreadTeam;
      scoringType: ScoringType;
    }

    export interface Clock {
      value: number;
      displayValue: string;
    }

    export interface Standing {
      fullViewLink: FullViewLinkElement;
      groups: Group[];
    }

    export interface Group {
      standings: GroupStandings;
      header: string;
      href: string;
    }

    export interface GroupStandings {
      entries: Entry[];
    }

    export interface Entry {
      team: string;
      link: string;
      id: string;
      uid: string;
      stats: Stat[];
      logo: LogoElement[];
    }

    export interface Stat {
      name: StatName;
      displayName?: StatDisplayName;
      shortDisplayName?: ShortDisplayNameEnum;
      description?: Description;
      abbreviation: ShortDisplayNameEnum;
      type: StatType;
      value?: number;
      displayValue: string;
      id?: string;
      summary?: string;
    }

    export enum ShortDisplayNameEnum {
      Any = "Any",
      L = "L",
      Pa = "PA",
      Pct = "PCT",
      Pf = "PF",
      T = "T",
      W = "W",
    }

    export enum Description {
      Losses = "Losses",
      Ties = "Ties",
      TotalPointsAgainst = "Total Points Against",
      TotalPointsFor = "Total Points For",
      WINS = "Wins",
      WinningPercentage = "Winning Percentage",
    }

    export enum StatDisplayName {
      Losses = "Losses",
      PointsAgainst = "Points Against",
      PointsFor = "Points For",
      Ties = "Ties",
      WINS = "Wins",
      WinPercentage = "Win Percentage",
    }

    export enum StatName {
      Losses = "losses",
      Overall = "overall",
      PointsAgainst = "pointsAgainst",
      PointsFor = "pointsFor",
      Ties = "ties",
      WINS = "wins",
      WinPercent = "winPercent",
    }

    export enum StatType {
      Losses = "losses",
      Pointsagainst = "pointsagainst",
      Pointsfor = "pointsfor",
      Ties = "ties",
      Total = "total",
      WINS = "wins",
      Winpercent = "winpercent",
    }

    export interface Winprobability {
      tiePercentage: number;
      homeWinPercentage: number;
      secondsLeft: number;
      playId: string;
    }
  }

  export namespace ResponseLeagueYearlySchedule {
    export interface LeagueYearlySchedule {
      leagues: League[];
      events: Event[];
    }

    export interface Event {
      id: string;
      uid: string;
      date: string;
      name: string;
      shortName: string;
      season: EventSeason;
      week: Week;
      competitions: Competition[];
      links: EventLink[];
      status: Status;
    }

    export interface Competition {
      id: string;
      uid: string;
      date: string;
      attendance: number;
      type: CompetitionType;
      timeValid: boolean;
      neutralSite: boolean;
      conferenceCompetition: boolean;
      playByPlayAvailable: boolean;
      recent: boolean;
      venue: CompetitionVenue;
      competitors: Competitor[];
      notes: Note[];
      status: Status;
      broadcasts: Broadcast[];
      leaders?: CompetitionLeader[];
      format: Format;
      startDate: string;
      geoBroadcasts: GeoBroadcast[];
      headlines?: Headline[];
    }

    export interface Broadcast {
      market: MarketEnum;
      names: NameElement[];
    }

    export enum MarketEnum {
      National = "national",
    }

    export enum NameElement {
      Abc = "ABC",
      Cbs = "CBS",
      Espn = "ESPN",
      Espn2 = "ESPN2",
      Fox = "FOX",
      NameESPN = "ESPN+",
      Nbc = "NBC",
      NflNet = "NFL NET",
      Peacock = "Peacock",
      PrimeVideo = "PRIME VIDEO",
    }

    export interface Competitor {
      id: string;
      uid: string;
      type: TypeElement;
      order: number;
      homeAway: HomeAway;
      winner: boolean;
      team: Team;
      score: string;
      linescores?: Linescore[];
      statistics: any[];
      records?: Record[];
    }

    export enum HomeAway {
      Away = "away",
      Home = "home",
    }

    export interface Linescore {
      value: number;
    }

    export interface Record {
      name: RecordName;
      abbreviation?: RecordAbbreviation;
      type: RecordType;
      summary: string;
    }

    export enum RecordAbbreviation {
      Any = "Any",
      Game = "Game",
    }

    export enum RecordName {
      Home = "Home",
      Overall = "overall",
      Road = "Road",
    }

    export enum RecordType {
      Home = "home",
      Road = "road",
      Total = "total",
    }

    export interface Team {
      id: string;
      uid: string;
      location: string;
      name?: string;
      abbreviation: string;
      displayName: string;
      shortDisplayName: string;
      color?: string;
      alternateColor?: AlternateColor;
      isActive: boolean;
      venue?: TeamClass;
      links: TeamLink[];
      logo: string;
    }

    export enum AlternateColor {
      A5Acaf = "a5acaf",
      B0B7Bc = "b0b7bc",
      B3995D = "b3995d",
      Bbbbbb = "bbbbbb",
      C41230 = "c41230",
      C60C30 = "c60c30",
      C9243F = "c9243f",
      D50A0A = "d50a0a",
      D7A22A = "d7a22a",
      E64100 = "e64100",
      Fc4C02 = "fc4c02",
      Ff3C00 = "ff3c00",
      Ffb612 = "ffb612",
      Ffc20E = "ffc20e",
      Ffc62F = "ffc62f",
      Ffd100 = "ffd100",
      Ffffff = "ffffff",
      The000000 = "000000",
      The002A5C = "002a5c",
      The3E3A35 = "3e3a35",
      The69Be28 = "69be28",
    }

    export interface TeamLink {
      rel: TypeElement[];
      href: string;
      text: Text;
      isExternal: boolean;
      isPremium: boolean;
    }

    export enum TypeElement {
      Clubhouse = "clubhouse",
      Desktop = "desktop",
      Roster = "roster",
      Schedule = "schedule",
      Stats = "stats",
      Team = "team",
    }

    export enum Text {
      Clubhouse = "Clubhouse",
      Roster = "Roster",
      Schedule = "Schedule",
      Statistics = "Statistics",
    }

    export interface TeamClass {
      id: string;
    }

    export interface Format {
      regulation: Regulation;
    }

    export interface Regulation {
      periods: number;
    }

    export interface GeoBroadcast {
      type: GeoBroadcastType;
      market: MarketClass;
      media: Media;
      lang: Lang;
      region: Region;
    }

    export enum Lang {
      En = "en",
    }

    export interface MarketClass {
      id: string;
      type: MarketType;
    }

    export enum MarketType {
      National = "National",
    }

    export interface Media {
      shortName: NameElement;
    }

    export enum Region {
      Us = "us",
    }

    export interface GeoBroadcastType {
      id: string;
      shortName: ShortName;
    }

    export enum ShortName {
      Tv = "TV",
      Web = "Web",
    }

    export interface Headline {
      description: string;
      type: ShortText;
      shortLinkText: string;
    }

    export enum ShortText {
      BoxScore = "Box Score",
      Gamecast = "Gamecast",
      Highlights = "Highlights",
      PlayByPlay = "Play-by-Play",
      Recap = "Recap",
    }

    export interface CompetitionLeader {
      name: LeaderName;
      displayName: DisplayName;
      shortDisplayName: ShortDisplayName;
      abbreviation: LeaderAbbreviation;
      leaders: LeaderLeader[];
    }

    export enum LeaderAbbreviation {
      Pyds = "PYDS",
      Recyds = "RECYDS",
      Ryds = "RYDS",
    }

    export enum DisplayName {
      PassingLeader = "Passing Leader",
      ReceivingLeader = "Receiving Leader",
      RushingLeader = "Rushing Leader",
    }

    export interface LeaderLeader {
      displayValue: string;
      value: number;
      athlete: Athlete;
      team: TeamClass;
    }

    export interface Athlete {
      id: string;
      fullName: string;
      displayName: string;
      shortName: string;
      links: AthleteLink[];
      headshot: string;
      jersey?: string;
      position: Position;
      team: TeamClass;
      active: boolean;
    }

    export interface AthleteLink {
      rel: PurpleRel[];
      href: string;
    }

    export enum PurpleRel {
      Athlete = "athlete",
      Desktop = "desktop",
      Playercard = "playercard",
    }

    export interface Position {
      abbreviation: PositionAbbreviation;
    }

    export enum PositionAbbreviation {
      Qb = "QB",
      Rb = "RB",
      Te = "TE",
      Wr = "WR",
    }

    export enum LeaderName {
      PassingYards = "passingYards",
      ReceivingYards = "receivingYards",
      RushingYards = "rushingYards",
    }

    export enum ShortDisplayName {
      Pass = "PASS",
      Rec = "REC",
      Rush = "RUSH",
    }

    export interface Note {
      type: TypeEnum;
      headline: string;
    }

    export enum TypeEnum {
      Boxscore = "boxscore",
      Desktop = "desktop",
      Event = "event",
      Highlights = "highlights",
      Pbp = "pbp",
      Recap = "recap",
      Summary = "summary",
    }

    export interface Status {
      clock: number;
      displayClock: DisplayClock;
      period: number;
      type: StatusType;
    }

    export enum DisplayClock {
      The000 = "0:00",
    }

    export interface StatusType {
      id: string;
      name: TypeName;
      state: State;
      completed: boolean;
      description: Description;
      detail: Description;
      shortDetail: Description;
      altDetail?: AltDetail;
    }

    export enum AltDetail {
      Ot = "OT",
    }

    export enum Description {
      Final = "Final",
      FinalOT = "Final/OT",
    }

    export enum TypeName {
      StatusFinal = "STATUS_FINAL",
    }

    export enum State {
      Post = "post",
    }

    export interface CompetitionType {
      id: string;
      abbreviation: TypeAbbreviation;
    }

    export enum TypeAbbreviation {
      Allstar = "ALLSTAR",
      Std = "STD",
    }

    export interface CompetitionVenue {
      id: string;
      fullName: string;
      address: Address;
      capacity: number;
      indoor: boolean;
    }

    export interface Address {
      city: string;
      state?: string;
    }

    export interface EventLink {
      language: Language;
      rel: TypeEnum[];
      href: string;
      text: ShortText;
      shortText: ShortText;
      isExternal: boolean;
      isPremium: boolean;
    }

    export enum Language {
      EnUS = "en-US",
    }

    export interface EventSeason {
      year: number;
      type: number;
      slug: Slug;
    }

    export enum Slug {
      PostSeason = "post-season",
      Preseason = "preseason",
      RegularSeason = "regular-season",
    }

    export interface Week {
      number: number;
    }

    export interface League {
      id: string;
      uid: string;
      name: string;
      abbreviation: string;
      slug: string;
      season: LeagueSeason;
      logos: Logo[];
      calendarType: string;
      calendarIsWhitelist: boolean;
      calendarStartDate: string;
      calendarEndDate: string;
      calendar: Calendar[];
    }

    export interface Calendar {
      label: string;
      value: string;
      startDate: string;
      endDate: string;
      entries: Entry[];
    }

    export interface Entry {
      label: string;
      alternateLabel: string;
      detail: string;
      value: string;
      startDate: string;
      endDate: string;
    }

    export interface Logo {
      href: string;
      width: number;
      height: number;
      alt: string;
      rel: string[];
      lastUpdated: string;
    }

    export interface LeagueSeason {
      year: number;
      startDate: string;
      endDate: string;
      displayName: string;
      type: SeasonType;
    }

    export interface SeasonType {
      id: string;
      type: number;
      name: string;
      abbreviation: State;
    }
  }
}
