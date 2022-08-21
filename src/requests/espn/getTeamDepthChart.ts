import { Team, Player } from '@prisma/client';
import axios from 'axios';
import jsdom from 'jsdom';

import { Status } from '../../types/Players';
import { getPlayerID } from '../../util/getEspnPlayerId';

export const getTeamDepthChart: (
  team: Team & {
    players: Player[];
  }
) => Promise<
  Team & {
    players: Player[];
  }
> = async team => {
  const { JSDOM } = jsdom;
  const url = team.depthChartUrl;
  const html = await axios.get(url);
  const dom = new JSDOM(html.data);
  const tablesArray = dom.window.document.querySelectorAll('table tbody');
  tablesArray.forEach((ta, idx) => {
    if (idx % 2 !== 0) {
      let wrSet = 1;
      const playerRows = ta.querySelectorAll('.Table__TR');
      playerRows.forEach(pr => {
        handleDepthChartRow(pr, team, idx, tablesArray, wrSet);
      });
    }
  });
  return team;
};

const handleDepthChartRow: (
  pr: Element,
  t: Team & {
    players: Player[];
  },
  tableIDX: number,
  tablesArray: NodeListOf<Element>,
  wrSet?: number
) => Team = (pr, t, tableIDX, tablesArray, wrSet) => {
  const td = pr.querySelectorAll('.Table__TD');
  let depth = 0;
  td.forEach(p => {
    let pl = p.querySelector('a');
    if (pl) {
      const playerUrl = pl.href;
      const playerID = getPlayerID(playerUrl);
      const playerName = pl.textContent;
      const player = t.players.find(play => {
        return play.espnPlayerId === playerID;
      });

      if (player) {
        const idx = parseInt(
          pl.parentElement.parentElement.parentElement.dataset.idx ?? ''
        );
        const positionTable = tablesArray[tableIDX - 1];
        const posTableRows = positionTable.querySelectorAll('tr');
        const rowDepthPositions = [];
        posTableRows.forEach(tr => {
          const secondaryPosition = tr
            .querySelector('.Table__TD')
            .textContent.trim();
          const count = rowDepthPositions.filter(
            r => r === secondaryPosition
          ).length;
          if (count > 0) {
            const positionCount = count + 1;
            rowDepthPositions.push(secondaryPosition + positionCount);
          } else {
            rowDepthPositions.push(secondaryPosition);
          }
        });
        posTableRows.forEach((tr, trIndex) => {
          if (parseInt(tr.dataset.idx) === idx) {
            player.playerDepthPosition.push(rowDepthPositions[trIndex]);
          }
        });
        depth++;
        const status = p
          .querySelector('.nfl-injuries-status')
          .textContent.trim();
        player.injuryStatus = status as Status;
        if (!player.depth) {
          player.depth = depth;
        }
      } else {
        const newPlayer: Player = {
          id: undefined,
          teamId: t.id,
          playerImageSrc:
            'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png',
          playerUrl: playerUrl,
          name: playerName,
          number: undefined,
          pos: undefined,
          age: undefined,
          height: undefined,
          weight: undefined,
          experience: undefined,
          college: undefined,
          positionGroup: undefined,
          playerDepthPosition: [],
          injuryStatus: undefined,
          depth: undefined,
          createdAt: undefined,
          leagueId: t.leagueId,
          updatedAt: undefined,
          batting: undefined,
          throwing: undefined,
          birthDate: undefined,
          birthPlace: undefined,
          shot: undefined,
          salary: undefined,
          espnPlayerId: playerID,
        };

        const idx = parseInt(
          pl.parentElement.parentElement.parentElement.dataset.idx ?? ''
        );
        const positionTable = tablesArray[tableIDX - 1];
        const posTableRows = positionTable.querySelectorAll('tr');
        const rowDepthPositions = [];
        posTableRows.forEach(tr => {
          const secondaryPosition = tr
            .querySelector('.Table__TD')
            .textContent.trim();
          const count = rowDepthPositions.filter(
            r => r === secondaryPosition
          ).length;
          if (count > 0) {
            const positionCount = count + 1;
            rowDepthPositions.push(secondaryPosition + positionCount);
          } else {
            rowDepthPositions.push(secondaryPosition);
          }
        });
        posTableRows.forEach((tr, trIndex) => {
          if (parseInt(tr.dataset.idx) === idx) {
            newPlayer.playerDepthPosition.push(rowDepthPositions[trIndex]);
          }
        });
        depth++;
        const status = p
          .querySelector('.nfl-injuries-status')
          .textContent.trim();
        newPlayer.injuryStatus = status as Status;
        if (!newPlayer.depth) {
          newPlayer.depth = depth;
        }
        t.players.push(newPlayer);
      }
    }
  });
  return t;
};
