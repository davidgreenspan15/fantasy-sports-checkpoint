import { Prisma, ScrapedTeam } from "@prisma/client";
import jsdom from "jsdom";
import axios from "axios";

// Based on league make a request for each week of the season to get the schedule of games then return then teams
//For Now just football

export const scrapeGames: (
  teams: ScrapedTeam[]
) => Promise<Prisma.ScrapedGameCreateManyInput[]> = async (teams) => {
  const response = await Promise.all(
    teams.map(async (t) => {
      const res = await scrapeTeamGames(t, teams);
      return res;
    })
  );

  return response.flat();
};

export const scrapeTeamGames: (
  team: ScrapedTeam,
  teams: ScrapedTeam[]
) => Promise<Prisma.ScrapedGameCreateManyInput[]> = async (team, teams) => {
  const { JSDOM } = jsdom;
  const url = team.scheduleUrl;
  const html = await axios.get(url);
  const dom = new JSDOM(html.data);
  const tablesArray = dom.window.document.querySelectorAll("table");
  const games = [];
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
};

const handleGameRow: (
  gameRow: Element,
  team: ScrapedTeam,
  columnsDB: {},
  teams: ScrapedTeam[],
  year: string
) => Prisma.ScrapedGameCreateManyInput = (
  gameRow,
  team,
  columnsDB,
  teams,
  year
) => {
  const game = {
    homeTeamId: team.id,
    awayTeamId: "",
    date: new Date(),
  };
  const rowColumns = gameRow.querySelectorAll("td");
  const dateColumn = rowColumns[columnsDB["date"]];
  if (!dateColumn) {
    return null;
  }
  const dateValue = dateColumn.textContent;

  if (dateValue.includes("BYE WEEK")) {
    return null;
  }
  if (dateValue.includes("Jan") || dateValue.includes("Feb")) {
    year = "2024";
  }
  const time = rowColumns[columnsDB["time"]].textContent;
  const opponent = rowColumns[columnsDB["opponent"]].querySelector("a").href;
  console.log(opponent);
  const date = dateValue.split(", ")[1] + " " + year;
  let [hrMm, amPm] = time.split(" ");
  if (hrMm.split(":").length === 1) {
    return null;
  }
  if (amPm === "PM") {
    const [hr, mm] = hrMm.split(":");
    if (hr !== "12") {
      const newHr = parseInt(hr) + 12;
      hrMm = `${newHr}:${mm}`;
    }
  }
  game.date = new Date(`${date} ${hrMm}`);
  game.awayTeamId = teams.find((t) => {
    return t.abr === opponent.split("/")[5];
  })?.id;
  return game;
};
