import { FantasyProsData, Team } from '@prisma/client';
import { NormalizedPlayerResponse } from '../types/normalizedPlayers';

export const mergeValues: (
  v2: {
    id: string;
    number: string;
    name: string;
    pos: string;
    team: Team;
    injuryStatus: string;
    depth: number;
    positionGroup: string;
    playerImageSrc: string;
    height: string;
    weight: string;
    experience: string;
    playerDepthPosition: string[];
  }[],
  v1: (FantasyProsData & {
    player: {
      number: string;
      pos: string;
      team: Team;
      name: string;
      injuryStatus: string;
      depth: number;
      positionGroup: string;
      playerImageSrc: string;
      height: string;
      weight: string;
      experience: string;
      playerDepthPosition: string[];
    };
  })[]
) => NormalizedPlayerResponse[] = (v2, v1) => {
  const normalizedP: NormalizedPlayerResponse[] = [];
  v1.forEach(p => {
    const player = p.player;
    const team = player?.team;

    const playerDepthPosition = p.player?.playerDepthPosition
      ? p.player?.playerDepthPosition.join(', ')
      : undefined;
    delete p.player;
    const teamName = [team?.city, team?.name].filter(v => !!v).join(' ');
    const getRndP = getRoundAndPick(p.avgAdp);
    const nPlayer: NormalizedPlayerResponse = {
      ...player,
      ...p,
      pos: p.pos ?? player.pos,
      teamName: teamName,
      teamAbr: team?.abr,
      teamImgSrc: team?.imgSrc,
      playerDepthPosition,
      drafted: false,
      getRoundAndPick: getRndP,
    };
    normalizedP.push(nPlayer);
  });
  v2.forEach(p => {
    const team = p?.team;
    const sameTeam = normalizedP.find(n => n.teamAbr === team.abr);
    const playerDepthPosition = p.playerDepthPosition
      ? p.playerDepthPosition.join(', ')
      : undefined;
    const teamName = [team?.city, team?.name].filter(v => !!v).join(' ');
    const nPlayer: NormalizedPlayerResponse = {
      ...p,
      playerName: p.name,
      playerId: p.id,
      teamName: teamName,
      teamAbr: team.abr,
      teamImgSrc: team.imgSrc,
      byeWeek: sameTeam.byeWeek,
      playerDepthPosition,
      drafted: false,
    };
    normalizedP.push(nPlayer);
  });
  return normalizedP;
};

const getRoundAndPick = (adp?: string) => {
  if (adp) {
    const playerRoundSplit = adp.split('.');
    let round = Math.ceil(parseInt(playerRoundSplit[0]) / 12);
    let pick = Math.round(parseFloat(adp) / round);
    if (pick === 0) {
      pick = 12;
    }
    const draftRoundAndPick = `Round ${round} Pick ${pick}`;
    return draftRoundAndPick;
  }
};
