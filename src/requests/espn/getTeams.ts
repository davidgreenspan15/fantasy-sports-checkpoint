import { League, Team } from '@prisma/client';
import axios from 'axios';
import jsdom from 'jsdom';

import { LeaguesResponse } from '../../types/LeagueResponse';
import { getPlayers } from './getPlayers';

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
  const url = l.depthChartUrl;
  const html = await axios.get(url);
  const dom = new JSDOM(html.data);

  const imageURls: string[] = [];
  const teams: Team[] = [];

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
      if (a.href.includes(`https://www.espn.com/${l.abr}/team/depth/_/name/`)) {
        const abr = a.href.replace(
          `https://www.espn.com/${l.abr}/team/depth/_/name/`,
          ''
        );
        const img = imageURls.find(i => {
          if (i.includes(`teamlogos/${l.abr}/500/`)) {
            const firstSplit = i.split(`teamlogos/${l.abr}/500/`)[1];
            const imageIBR = firstSplit.split('.png')[0];
            if (imageIBR === abr || imageIBR === abrImageMap[abr]) {
              return i;
            }
          }
        });
        const team: Team = {
          id: undefined,
          depthChartUrl: a.href,
          abr,
          imgSrc: img,
          rosterUrl: `https://www.espn.com/${l.abr}/team/roster/_/name/${abr}`,
          leagueId: l.id,
          city: undefined,
          name: undefined,
          updatedAt: undefined,
          createdAt: undefined,
        };
        l.teams.push(team as Team);
      }
    });

  return teams;
};
