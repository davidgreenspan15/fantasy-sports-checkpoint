import {
  Prisma,
  ScrapedLeague,
  ScrapedPlayer,
  ScrapedTeam,
} from "@prisma/client";
import axios from "axios";
import jsdom from "jsdom";
import {
  handleDepthChartRow,
  handleGameRow,
  handleMlbPlayerRow,
  handleNbaPlayerRow,
  handleNflPlayerRow,
  handleNhlPlayerRow,
} from "./helpers";

export const scrapeRequestBuilder = {
  scrapeTeamListRequest: async (
    l: ScrapedLeague & {
      teams: ScrapedTeam[];
    }
  ) => {
    const { JSDOM } = jsdom;
    const url = l.teamsListUrl;
    const html = await axios.get(url);
    const dom = new JSDOM(html.data, { resources: "usable" });
    const abrImageMap = {
      wsh: "was",
      jax: "jac",
      lv: "oak",
    };
    dom.window.document
      .querySelectorAll("section.TeamLinks")
      .forEach(async (section: HTMLElement) => {
        const teamMainContainer = section.querySelector("div");
        const teamUrl =
          "https://www.espn.com" +
          teamMainContainer.querySelector("a").href.split("&")[0];
        const teamAbr = teamUrl.split("/")[7];
        const abr = abrImageMap[teamAbr] ?? (teamAbr as string);
        const teamImage = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/${l.abr}/500/${abr}.png`;

        const teamLinksRow = teamMainContainer.querySelector(
          "div.TeamLinks__Links"
        );
        const allUrls = teamLinksRow.querySelectorAll("a");
        const allUrlsAs: HTMLAnchorElement[] = [];
        allUrls.forEach((a) => {
          allUrlsAs.push(a);
        });
        const rosterUrl = allUrlsAs.find((a) => {
          return a.textContent.toLowerCase() === "roster";
        });
        const depthChartUrl = allUrlsAs.find((a) => {
          return a.textContent.toLowerCase() === "depth chart";
        });

        const scheduleUrl = allUrlsAs.find((a) => {
          return a.textContent.toLowerCase() === "schedule";
        });

        let team: ScrapedTeam = {
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
          scheduleUrl: undefined,
        };
        if (rosterUrl) {
          team.rosterUrl = "https://www.espn.com" + rosterUrl.href;
        }
        if (depthChartUrl) {
          team.depthChartUrl = "https://www.espn.com" + depthChartUrl.href;
        }
        if (scheduleUrl) {
          team.scheduleUrl = "https://www.espn.com" + scheduleUrl.href;
        }
        l.teams.push(team as ScrapedTeam);
      });
    const response = await Promise.all(
      l.teams.map(async (t) => {
        if (t.rosterUrl) {
          await scrapeRequestBuilder.getTeamCityAndName(t);
        }
        return t;
      })
    );
    return l.teams;
  },
  getTeamCityAndName: async (team: ScrapedTeam) => {
    const { JSDOM } = jsdom;
    const url = team.rosterUrl;
    const html = await axios.get(url);
    const dom = new JSDOM(html.data);
    const teamNameAndCity = dom.window.document.querySelectorAll(
      "h1.ClubhouseHeader__Name span span"
    );
    team.city = teamNameAndCity[0].textContent;
    team.name = teamNameAndCity[1].textContent;
    return team;
  },
  scrapeRosterRequest: async (
    team: ScrapedTeam & {
      league: ScrapedLeague;
      players: ScrapedPlayer[];
    }
  ) => {
    const { JSDOM } = jsdom;
    const url = team.rosterUrl;
    const html = await axios.get(url);
    const dom = new JSDOM(html.data);
    const tablesArray = dom.window.document.querySelectorAll("table");
    const tablesTitles =
      dom.window.document.querySelectorAll("div.Table__Title");

    tablesArray.forEach((ta, idx) => {
      const positionGroup = tablesTitles[idx].textContent;
      const playerRows = ta.querySelectorAll("tbody tr.Table__TR");
      playerRows.forEach((pr) => {
        switch (team.league.abr) {
          case "nfl":
            const nflPlayer = handleNflPlayerRow(pr, positionGroup, team);
            team.players.push(nflPlayer);
            break;
          case "nba":
            const nbaPlayer = handleNbaPlayerRow(pr, positionGroup, team);
            team.players.push(nbaPlayer);
            break;
          case "nhl":
            const nhlPlayer = handleNhlPlayerRow(pr, positionGroup, team);
            team.players.push(nhlPlayer);
            break;
          case "mlb":
            const mlbPlayer = handleMlbPlayerRow(pr, positionGroup, team);
            team.players.push(mlbPlayer);
            break;
          default:
            break;
        }
      });
    });

    return team;
  },
  scrapeDepthChartRequest: async (
    team: ScrapedTeam & {
      players: ScrapedPlayer[];
    }
  ) => {
    const { JSDOM } = jsdom;
    const url = team.depthChartUrl;
    const html = await axios.get(url);
    const dom = new JSDOM(html.data);
    const tablesArray = dom.window.document.querySelectorAll("table tbody");
    tablesArray.forEach((ta, idx) => {
      if (idx % 2 !== 0) {
        let wrSet = 1;
        const playerRows = ta.querySelectorAll(".Table__TR");
        playerRows.forEach((pr) => {
          handleDepthChartRow(pr, team, idx, tablesArray, wrSet);
        });
      }
    });
    return team;
  },
  scrapeTeamGamesRequest: async (team: ScrapedTeam, teams: ScrapedTeam[]) => {
    const { JSDOM } = jsdom;
    const url = team.scheduleUrl;
    const html = await axios.get(url);
    const dom = new JSDOM(html.data);
    const tablesArray = dom.window.document.querySelectorAll("table");
    const games: Prisma.ScrapedGameCreateManyInput[] = [];
    let startingRow = 0;
    tablesArray.forEach((ta, idx) => {
      const row = ta.querySelectorAll("tbody tr.Table__TR");
      const gameRows = [];
      const columnsDB = {};
      row.forEach((gr, idx) => {
        const columns = gr.querySelectorAll("td.Table__TD");
        columns.forEach((c, index) => {
          switch (c.textContent) {
            case "TIME":
              startingRow = idx + 1;
              columnsDB["time"] = index;
              break;
            case "OPPONENT":
              columnsDB["opponent"] = index;
              break;
            case "DATE":
              columnsDB["date"] = index;
              break;

            default:
              break;
          }
        });
        gameRows.push(gr);
      });

      let year = "2023";
      gameRows.slice(startingRow).forEach((gr, i) => {
        const firstColumn = gr.querySelector("td");
        if (
          (firstColumn && firstColumn.className.includes("Table__Title")) ||
          firstColumn.className.includes("Table_Headers")
        ) {
          return;
        } else {
          const game = handleGameRow(gr, team, columnsDB, teams, year);
          if (game) {
            games.push(game);
          }
        }
      });
    });
    return games;
  },
  scrapeMorePlayerInfo: async (player: ScrapedPlayer) => {
    const { JSDOM } = jsdom;
    const url = player.playerUrl;
    const html = await axios.get(url);
    const dom = new JSDOM(html.data);
    const playerBio = dom.window.document.querySelectorAll(
      ".PlayerHeader__Bio li div"
    );
    let birthdayRow = undefined;
    playerBio.forEach((pb, idx) => {
      if (birthdayRow === idx) {
        player.birthDate = pb.textContent.split(" ")[0];
      }
      if (pb.textContent === "Birthdate") {
        birthdayRow = idx + 1;
      }
    });
    return player;
  },
};
