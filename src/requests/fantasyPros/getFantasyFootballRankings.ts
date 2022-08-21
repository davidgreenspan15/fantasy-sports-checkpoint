import { AllPlayers, PlayerData } from '../../types/Players';
import jsdom from 'jsdom';
import axios from 'axios';
import { Team, Player, FantasyProsData } from '@prisma/client';
import { Domain } from 'domain';

export const getFantasyProsData: (
  teams: (Team & {
    players: Player[];
  })[]
) => Promise<FantasyProsData[]> = async teams => {
  const { JSDOM } = jsdom;
  const url =
    'https://www.fantasypros.com/nfl/rankings/half-point-ppr-cheatsheets.php';
  const html = await axios.get(url);

  const dom = new JSDOM(html.data, {
    runScripts: 'dangerously',
    resources: 'usable',
  });

  console.debug('Hit a');
  const fpsData = getOverView(dom, teams);
  console.debug('Hit b');
  getRanks(dom, fpsData);
  console.debug('Hit c');
  return fpsData;
};

const getOverView = (
  dom: jsdom.JSDOM,
  teams: (Team & {
    players: Player[];
  })[]
) => {
  console.debug('Hit a inner 1');

  const table = dom.window.document.querySelector('table');
  console.debug('Hit a inner 2', table);

  const fpsData: FantasyProsData[] = [];
  const playerRows = table.querySelectorAll('tr.player-row');
  console.debug('Hit a inner 3');

  playerRows.forEach((r, idx) => {
    console.debug('Hit a inner 4', idx);

    const playerCells = r.querySelectorAll('td');
    const playerRank = parseInt(playerCells[0].textContent);
    const playerNameCell = playerCells[2].querySelector('a');
    const playerName = playerNameCell.textContent.trim();
    const pos = playerCells[3].textContent.trim();
    const byeWeek = isNaN(parseInt(playerCells[4].textContent))
      ? undefined
      : parseInt(playerCells[4].textContent);
    const strengthOgSchedule = playerCells[5].textContent.trim();

    const teamAbr = playerNameCell
      .querySelector('span.player-cell-team')
      .textContent.trim();
    const team = teams.find(
      t =>
        t.abr.toLowerCase() === teamAbr.replace('s/([()])//g', '').toLowerCase()
    );
    if (team) {
      const player = team.players.find(
        p => p.name.toLowerCase() === playerName.toLowerCase()
      );
      if (player) {
        const fpsPlayerData: FantasyProsData = {
          id: undefined,
          playerId: player.id,
          rank: playerRank,
          playerName: playerName,
          pos: pos,
          teamAbr,
          byeWeek: byeWeek,
          strengthOgSchedule: strengthOgSchedule,
          avgAdp: undefined,
          notes: undefined,
          avgFanPoints: undefined,
          avgPassingYds: undefined,
          avgPassingTds: undefined,
          avgReceivingRec: undefined,
          avgReceivingYds: undefined,
          avgReceivingTds: undefined,
          avgRushingAtt: undefined,
          avgRushingYds: undefined,
          avgRushingTds: undefined,
          totalFanPoints: undefined,
          totalPassingYds: undefined,
          totalPassingTds: undefined,
          totalReceivingRec: undefined,
          totalReceivingYds: undefined,
          totalReceivingTds: undefined,
          totalRushingAtt: undefined,
          totalRushingYds: undefined,
          totalRushingTds: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        };
        fpsData.push(fpsPlayerData);
      }
    }
  });

  return fpsData;
};

const getRanks: (
  dom: jsdom.JSDOM,
  fpsData: FantasyProsData[]
) => FantasyProsData[] = (dom, fpsData) => {
  const listOptions = dom.window.document.querySelectorAll(
    'div#select-advanced-6980121 ul li'
  );
  const listOptionsArray: Element[] = [];
  listOptions.forEach(o => listOptionsArray.push(o));
  const findOption = listOptionsArray.find(o => {
    return o.textContent.trim() === 'Ranks';
  });
  if (findOption) {
    const button = findOption.querySelector('button');
    button.click();
  }
  const table = dom.window.document.querySelector('table');
  const playerRows = table.querySelectorAll('tr.player-row');
  playerRows.forEach(r => {
    const playerCells = r.querySelectorAll('td');
    const playerNameCell = playerCells[2].querySelector('a');
    const playerName = playerNameCell.textContent.trim();
    const avgAdp = playerCells[6].textContent.trim();
    const teamAbr = playerNameCell
      .querySelector('span.player-cell-team')
      .textContent.trim();
    const player = fpsData.find(
      p =>
        p.playerName.toLowerCase() === playerName.toLowerCase() &&
        p.teamAbr === teamAbr
    );
    if (player) {
      player.avgAdp = avgAdp;
    }
  });
  return fpsData;
};
