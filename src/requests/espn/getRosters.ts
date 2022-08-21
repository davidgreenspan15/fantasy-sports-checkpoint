import { League, Player, Team } from '@prisma/client';
import axios from 'axios';
import jsdom from 'jsdom';

import { PlayerData, Pos } from '../../types/Players';
import { getPlayerID } from '../../util/getEspnPlayerId';

export const getRosters: (
  team: Team & {
    league: League;
    players: Player[];
  }
) => Promise<
  Team & {
    league: League;
    players: Player[];
  }
> = async team => {
  const { JSDOM } = jsdom;
  const url = team.rosterUrl;
  const html = await axios.get(url);
  const dom = new JSDOM(html.data);
  const tablesArray = dom.window.document.querySelectorAll('table');
  const tablesTitles = dom.window.document.querySelectorAll('div.Table__Title');

  tablesArray.forEach((ta, idx) => {
    const positionGroup = tablesTitles[idx].textContent;
    const playerRows = ta.querySelectorAll('tbody tr.Table__TR');
    playerRows.forEach(pr => {
      switch (team.league.abr) {
        case 'nfl':
          const nflPlayer = handleNflPlayerRow(pr, positionGroup, team);
          team.players.push(nflPlayer);
          break;
        case 'nba':
          const nbaPlayer = handleNbaPlayerRow(pr, positionGroup, team);
          team.players.push(nbaPlayer);
          break;
        case 'nhl':
          const nhlPlayer = handleNhlPlayerRow(pr, positionGroup, team);
          team.players.push(nhlPlayer);
          break;
        case 'mlb':
          const mlbPlayer = handleMlbPlayerRow(pr, positionGroup, team);
          team.players.push(mlbPlayer);
          break;
        default:
          break;
      }
    });
  });

  return team;
};

const handleNflPlayerRow: (
  playerRow: Element,
  positionGroup: string,
  team: Team
) => Player = (playerRow, positionGroup, team) => {
  const tds = playerRow.querySelectorAll('td');
  const playerImageSection = tds[0].querySelector(
    'div.headshot div.Image__Wrapper'
  );

  const playerImage = playerImageSection.querySelector('img').alt;
  const playerUrl = tds[1].querySelector('a').href;
  const playerID = getPlayerID(playerUrl);

  const playerData: Player = {
    id: undefined,
    teamId: team.id,
    playerImageSrc: playerImage,
    playerUrl: playerUrl,
    name: tds[1].querySelector('a').textContent,
    number: tds[1].querySelector('span.pl2')?.textContent ?? '',
    pos: tds[2].querySelector('div').textContent as Pos,
    age: tds[3].querySelector('div').textContent,
    height: tds[4].querySelector('div').textContent,
    weight: tds[5].querySelector('div').textContent,
    experience: tds[6].querySelector('div').textContent,
    college: tds[7].querySelector('div').textContent,
    positionGroup,
    playerDepthPosition: [],
    injuryStatus: undefined,
    depth: undefined,
    createdAt: undefined,
    leagueId: team.leagueId,
    updatedAt: undefined,
    batting: undefined,
    throwing: undefined,
    birthDate: undefined,
    birthPlace: undefined,
    shot: undefined,
    salary: undefined,
    espnPlayerId: playerID,
  };

  return playerData;
};

const handleNbaPlayerRow: (
  playerRow: Element,
  positionGroup: string,
  team: Team
) => Player = (playerRow, positionGroup, team) => {
  const tds = playerRow.querySelectorAll('td');
  const playerImageSection = tds[0].querySelector(
    'div.headshot div.Image__Wrapper'
  );
  const playerUrl = tds[1].querySelector('a').href;
  const playerID = getPlayerID(playerUrl);
  const playerImage = playerImageSection.querySelector('img').alt;
  const playerData: Player = {
    id: undefined,
    teamId: team.id,
    playerImageSrc: playerImage,
    playerUrl,
    name: tds[1].querySelector('a').textContent,
    number: tds[1].querySelector('span.pl2')?.textContent ?? '',
    pos: tds[2].querySelector('div').textContent as Pos,
    age: tds[3].querySelector('div').textContent,
    height: tds[4].querySelector('div').textContent,
    weight: tds[5].querySelector('div').textContent,
    experience: undefined,
    college: tds[6].querySelector('div').textContent,
    positionGroup,
    playerDepthPosition: [],
    injuryStatus: undefined,
    depth: undefined,
    createdAt: undefined,
    leagueId: team.leagueId,
    updatedAt: undefined,
    batting: undefined,
    throwing: undefined,
    birthDate: undefined,
    birthPlace: undefined,
    shot: undefined,
    salary: tds[7].querySelector('div').textContent,
    espnPlayerId: playerID,
  };

  return playerData;
};
const handleMlbPlayerRow: (
  playerRow: Element,
  positionGroup: string,
  team: Team
) => Player = (playerRow, positionGroup, team) => {
  const tds = playerRow.querySelectorAll('td');
  const playerImageSection = tds[0].querySelector(
    'div.headshot div.Image__Wrapper'
  );
  const playerUrl = tds[1].querySelector('a').href;
  const playerID = getPlayerID(playerUrl);
  const playerImage = playerImageSection.querySelector('img').alt;
  const playerData: Player = {
    id: undefined,
    teamId: team.id,
    playerImageSrc: playerImage,
    playerUrl,
    name: tds[1].querySelector('a').textContent,
    number: tds[1].querySelector('span.pl2')?.textContent ?? '',
    pos: tds[2].querySelector('div').textContent as Pos,
    age: tds[5].querySelector('div').textContent,
    height: tds[6].querySelector('div').textContent,
    weight: tds[7].querySelector('div').textContent,
    experience: undefined,
    college: undefined,
    positionGroup,
    playerDepthPosition: [],
    injuryStatus: undefined,
    depth: undefined,
    createdAt: undefined,
    leagueId: team.leagueId,
    updatedAt: undefined,
    batting: tds[3].querySelector('div').textContent,
    throwing: tds[4].querySelector('div').textContent,
    birthDate: undefined,
    birthPlace: tds[8].querySelector('div').textContent,
    shot: undefined,
    salary: undefined,
    espnPlayerId: playerID,
  };

  return playerData;
};

const handleNhlPlayerRow: (
  playerRow: Element,
  positionGroup: string,
  team: Team
) => Player = (playerRow, positionGroup, team) => {
  const tds = playerRow.querySelectorAll('td');
  const playerImageSection = tds[0].querySelector(
    'div.headshot div.Image__Wrapper'
  );
  const playerUrl = tds[1].querySelector('a').href;
  const playerID = getPlayerID(playerUrl);
  const playerImage = playerImageSection.querySelector('img').alt;
  const playerData: Player = {
    id: undefined,
    teamId: team.id,
    playerImageSrc: playerImage,
    playerUrl,
    name: tds[1].querySelector('a').textContent,
    number: tds[1].querySelector('span.pl2')?.textContent ?? '',
    pos: undefined,
    age: tds[2].querySelector('div').textContent,
    height: tds[3].querySelector('div').textContent,
    weight: tds[4].querySelector('div').textContent,
    experience: undefined,
    college: undefined,
    positionGroup,
    playerDepthPosition: [],
    injuryStatus: undefined,
    depth: undefined,
    createdAt: undefined,
    leagueId: team.leagueId,
    updatedAt: undefined,
    batting: undefined,
    throwing: undefined,
    birthDate: tds[7].querySelector('div').textContent,
    birthPlace: tds[6].querySelector('div').textContent,
    shot: tds[5].querySelector('div').textContent,
    salary: undefined,
    espnPlayerId: playerID,
  };

  return playerData;
};
