import { AllPlayers, PlayerData } from '../../types/Players';
import jsdom from 'jsdom';
import axios from 'axios';
import { Teams } from '../../types/Teams';

const getFantasyProsData: (teams: Teams) => Promise<Teams> = async teams => {
  const allPlayers: AllPlayers = [];
  ///
  //code here
  const { JSDOM } = jsdom;
  const url =
    'https://www.fantasypros.com/nfl/rankings/half-point-ppr-cheatsheets.php';
  const html = await axios.get(url);
  const dom = new JSDOM(html.data);

  const table = dom.window.document.querySelector('table');
  const playerRows = table.querySelectorAll('tr.player-row');
  // const playerColumnHeaders = table.querySelectorAll('');
  const playerCells = table.querySelectorAll('td');
  const playerRank = parseInt(playerCells[0].textContent);
  const playerNameCell = playerCells[2].querySelector('a');
  const playerName = playerNameCell.textContent;
  const teamAbr = playerNameCell.querySelector(
    'span.player-cell-team'
  ).textContent;
  const team = teams.find(
    t =>
      t.abr.toLowerCase() === teamAbr.replace('s/([()])//g', '').toLowerCase()
  );
  if (team) {
    const player = team.players.find(p => p.name.toLowerCase() === playerName);
    if (player) {
      if (!isNaN(playerRank)) {
        player.rank = playerRank;
      }
    }
  }

  return teams;
};
