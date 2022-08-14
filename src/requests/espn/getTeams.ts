import axios from 'axios';
import jsdom from 'jsdom';

import { League, LeaguesResponse } from '../../types/LeagueResponse';
import { Teams } from '../../types/Teams';
import { getPlayers } from './getPlayers';

export const getTeams: (
  leagueResponse: LeaguesResponse
) => Promise<LeaguesResponse> = async leagueResponse => {
  const { leagues, workflow } = leagueResponse;
  const response = await Promise.all(
    leagues.map(async l => {
      await getTeamList(l).then(async lg => {
        const resp = await Promise.all(
          lg.teams.map(async t => {
            const team = await getPlayers(t, workflow);
            return team;
          })
        );
        lg.teams = resp;
        return lg;
      });

      return l;
    })
  );
  return { leagues: response, workflow };
};

const getTeamList = async (l: League) => {
  const { JSDOM } = jsdom;
  const url = l.depthChartListUrl;
  const html = await axios.get(url);
  const dom = new JSDOM(html.data);

  const imageURls: string[] = [];
  const teams: Teams = [];

  dom.window.document
    .querySelectorAll('img')
    .forEach((img: HTMLImageElement) =>
      imageURls.push(img.src.replace('w=25&h=25', 'w=400&h=400'))
    );

  const abrImageMap = {
    wsh: 'was',
    jax: 'jac',
    lv: 'oak',
  };

  dom.window.document
    .querySelectorAll('.article-body h2 a')
    .forEach((a: HTMLAnchorElement) => {
      if (
        a.href.includes(`https://www.espn.com/${l.name}/team/depth/_/name/`)
      ) {
        const abr = a.href.replace(
          `https://www.espn.com/${l.name}/team/depth/_/name/`,
          ''
        );
        const img = imageURls.find(i => {
          if (i.includes(`teamlogos/${l.name}/500/`)) {
            const firstSplit = i.split(`teamlogos/${l.name}/500/`)[1];
            const imageIBR = firstSplit.split('.png')[0];
            if (imageIBR === abr || imageIBR === abrImageMap[abr]) {
              return i;
            }
          }
        });
        const team = {
          depthChartUrl: a.href,
          abr,
          imgSrc: img,
          rosterUrl: `https://www.espn.com/${l.name}/team/roster/_/name/${abr}`,
          players: [],
        };
        teams.push(team);
      }
    });

  l.teams = teams;
  return l;
};
