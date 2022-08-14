import axios from 'axios';
import jsdom from 'jsdom';

import { PlayerData, Pos } from '../../types/Players';
import { Team } from '../../types/Teams';

export const getRosters: (team: Team) => Promise<Team> = async team => {
  const { JSDOM } = jsdom;
  const url = team.rosterUrl;
  const html = await axios.get(url);
  const dom = new JSDOM(html.data);
  const teamNameAndCity = dom.window.document.querySelectorAll(
    'h1.ClubhouseHeader__Name span span'
  );
  team.city = teamNameAndCity[0].textContent;
  team.name = teamNameAndCity[1].textContent;
  const tablesArray = dom.window.document.querySelectorAll('table');
  const tablesTitles = dom.window.document.querySelectorAll('div.Table__Title');

  tablesArray.forEach((ta, idx) => {
    const positionGroup = tablesTitles[idx].textContent;
    const playerRows = ta.querySelectorAll('tbody tr.Table__TR');
    playerRows.forEach(pr => {
      const playerData = handlePlayerRow(pr, positionGroup);
      team.players.push(playerData);
    });
  });

  return team;
};

const handlePlayerRow: (playerRow: Element, positionGroup) => PlayerData = (
  playerRow,
  positionGroup
) => {
  const tds = playerRow.querySelectorAll('td');
  const playerImageSection = tds[0].querySelector(
    'div.headshot div.Image__Wrapper'
  );

  const playerImage = playerImageSection.querySelector('img').alt;
  const playerData: PlayerData = {
    playerImageSrc: playerImage,
    playerUrl: tds[1].querySelector('a').href,
    name: tds[1].querySelector('a').textContent,
    number: tds[1].querySelector('span.pl2')?.textContent ?? '',
    pos: tds[2].querySelector('div').textContent as Pos,
    age: tds[3].querySelector('div').textContent,
    height: tds[4].querySelector('div').textContent,
    weight: tds[5].querySelector('div').textContent,
    experience: tds[6].querySelector('div').textContent,
    college: tds[7].querySelector('div').textContent,
    positionGroup,
  };

  return playerData;
};
