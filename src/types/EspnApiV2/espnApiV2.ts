export namespace EspnApiV2 {
  export type TeamListResponse = ResponseTeamList.SportTeam;

  export type TeamScheduleResponse = ResponseTeamSchedule.Schedule;

  export type TeamRosterResponse = ResponseTeamRoster.Roster;

  export type LeagueAthleteListResponse = ResponseLeagueAthleteList.Athlete;

  export type TeamDepthChartResponse = ResponseTeamDepthChart.DepthChart;

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

  export namespace ResponseLeagueAthleteList {
    export interface Athlete {
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
}
