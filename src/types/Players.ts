export type AllPlayers = PlayerData[];
export interface PlayerData {
  name?: string;
  injuryStatus?: Status;
  pos?: Pos;
  depth?: number;
  positionGroup?: PosGroup;
  wrSet?: number;
  playerUrl?: string;
  playerImageSrc?: string;
  height?: string;
  weight?: string;
  experience?: string;
  college?: string;
  age?: string;
  number?: string;
  playerDepthPosition?: string[];
  rank?: number;
}

export enum Pos {
  C = 'C',
  FS = 'FS',
  Fb = 'FB',
  H = 'H',
  Kr = 'KR',
  Lcb = 'LCB',
  Lde = 'LDE',
  Ldt = 'LDT',
  Lg = 'LG',
  Lilb = 'LILB',
  Ls = 'LS',
  Lt = 'LT',
  Mlb = 'MLB',
  NT = 'NT',
  P = 'P',
  PR = 'PR',
  Pk = 'PK',
  Qb = 'QB',
  Rb = 'RB',
  Rcb = 'RCB',
  Rde = 'RDE',
  Rdt = 'RDT',
  Rg = 'RG',
  Rilb = 'RILB',
  Rt = 'RT',
  Slb = 'SLB',
  Ss = 'SS',
  Te = 'TE',
  Wlb = 'WLB',
  Wr = 'WR',
}

export enum PosGroup {
  Defense = 'Defense',
  Offense = 'Offense',
  SpecialTeams = 'Special Teams',
}

export enum Status {
  D = 'D',
  Empty = '',
  IR = 'IR',
  O = 'O',
  Q = 'Q',
  Susp = 'SUSP',
}
