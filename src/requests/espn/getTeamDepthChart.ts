import axios from 'axios';
import jsdom from 'jsdom';

import { Status } from '../../types/Players';
import { Team } from '../../types/Teams';

export const getTeamDepthChart: (team: Team) => Promise<Team> = async team => {
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
  t: Team,
  tableIDX: number,
  tablesArray: NodeListOf<Element>,
  wrSet?: number
) => Team = (pr, t, tableIDX, tablesArray, wrSet) => {
  const td = pr.querySelectorAll('.Table__TD');
  let addToWRSet = false;
  let depth = 0;
  td.forEach(p => {
    let pl = p.querySelector('a');
    if (pl) {
      const player = t.players.find(play => {
        return play.name === pl.textContent;
      });

      if (player) {
        const idx = parseInt(
          pl.parentElement.parentElement.parentElement.dataset.idx ?? ''
        );
        const tablet = tablesArray[tableIDX - 1];
        tablet.querySelectorAll('tr').forEach(tr => {
          if (parseInt(tr.dataset.idx) === idx) {
            const td = tr.querySelector('.Table__TD');
            if (td) {
              const secondaryPosition = td.textContent.trim();
              if (!player.playerDepthPosition) {
                player['playerDepthPosition'] = [];
              }
              player.playerDepthPosition.push(secondaryPosition);
            }
          }
        });
        depth++;
        const status = p
          .querySelector('.nfl-injuries-status')
          .textContent.trim();
        player.injuryStatus = status as Status;
        player.depth = depth;
        if (player.pos === 'WR') {
          addToWRSet = true;
        }

        if (player.pos === 'WR' && wrSet) {
          player.wrSet = wrSet;
        }
        if (addToWRSet && wrSet) {
          wrSet++;
        }
      }
    }
  });
  return t;
};
