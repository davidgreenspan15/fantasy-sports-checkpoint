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
