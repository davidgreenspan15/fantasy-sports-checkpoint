import { League, Team } from '@prisma/client';
import axios from 'axios';
import jsdom from 'jsdom';

export const getTeams: (
  leagues: (League & {
    teams: Team[];
  })[]
) => Promise<Team[]> = async leagues => {
  const teams: Team[] = [];
  const response = await Promise.all(
    leagues.map(async l => {
      await getTeamList(l);
      return l;
    })
  );
  leagues.forEach(l => teams.push(...l.teams));
  return teams;
};

const getTeamList = async (
  l: League & {
    teams: Team[];
  }
) => {
  const { JSDOM } = jsdom;
  const url = l.teamsListUrl;
  const html = await axios.get(url);
  const dom = new JSDOM(html.data, { resources: 'usable' });
  const abrImageMap = {
    wsh: 'was',
    jax: 'jac',
    lv: 'oak',
  };
  dom.window.document
    .querySelectorAll('section.TeamLinks')
    .forEach(async (section: HTMLElement) => {
      const teamMainContainer = section.querySelector('div');
      const teamUrl =
        'https://www.espn.com' +
        teamMainContainer.querySelector('a').href.split('&')[0];
      const teamAbr = teamUrl.split('/')[7];
      const abr = abrImageMap[teamAbr] ?? (teamAbr as string);
      const teamImage = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/${l.abr}/500/${abr}.png`;

      const teamLinksRow = teamMainContainer.querySelector(
        'div.TeamLinks__Links'
      );
      const allUrls = teamLinksRow.querySelectorAll('a');
      const allUrlsAs: HTMLAnchorElement[] = [];
      allUrls.forEach(a => {
        allUrlsAs.push(a);
      });
      const rosterUrl = allUrlsAs.find(a => {
        return a.textContent.toLowerCase() === 'roster';
      });
      const depthChartUrl = allUrlsAs.find(a => {
        return a.textContent.toLowerCase() === 'depth chart';
      });

      let team: Team = {
        id: undefined,
        depthChartUrl: undefined,
        teamUrl,
        abr: teamAbr,
        imgSrc: teamImage,
        rosterUrl: undefined,
        leagueId: l.id,
        city: undefined,
        name: undefined,
        updatedAt: undefined,
        createdAt: undefined,
      };
      if (rosterUrl) {
        team.rosterUrl = 'https://www.espn.com' + rosterUrl.href;
      }
      if (depthChartUrl) {
        team.depthChartUrl = 'https://www.espn.com' + depthChartUrl.href;
      }
      l.teams.push(team as Team);
    });
  const response = await Promise.all(
    l.teams.map(async t => {
      if (t.rosterUrl) {
        await getTeamCityAndName(t);
      }
      return t;
    })
  );
  return l.teams;
};

const getTeamCityAndName: (team: Team) => Promise<Team> = async team => {
  const { JSDOM } = jsdom;
  const url = team.rosterUrl;
  const html = await axios.get(url);
  const dom = new JSDOM(html.data);
  const teamNameAndCity = dom.window.document.querySelectorAll(
    'h1.ClubhouseHeader__Name span span'
  );
  team.city = teamNameAndCity[0].textContent;
  team.name = teamNameAndCity[1].textContent;
  return team;
};
