import { Prisma, ScrapedPlayer, ScrapedTeam } from "@prisma/client";
import { Pos, Status } from "../../types/Players";

export const handleNflPlayerRow: (
  playerRow: Element,
  positionGroup: string,
  team: ScrapedTeam
) => ScrapedPlayer = (playerRow, positionGroup, team) => {
  const tds = playerRow.querySelectorAll("td");
  const playerImageSection = tds[0].querySelector(
    "div.headshot div.Image__Wrapper"
  );

  const playerImage = playerImageSection.querySelector("img").alt;
  const playerUrl = tds[1].querySelector("a").href;
  const playerID = getPlayerID(playerUrl);

  const playerData: ScrapedPlayer = {
    id: undefined,
    teamId: team.id,
    playerImageSrc: playerImage,
    playerUrl: playerUrl,
    name: tds[1].querySelector("a").textContent,
    number: tds[1].querySelector("span.pl2")?.textContent ?? "",
    pos: tds[2].querySelector("div").textContent as Pos,
    age: tds[3].querySelector("div").textContent,
    height: tds[4].querySelector("div").textContent,
    weight: tds[5].querySelector("div").textContent,
    experience: tds[6].querySelector("div").textContent,
    college: tds[7].querySelector("div").textContent,
    positionGroup,
    playerDepthPosition: [],
    injuryStatus: undefined,
    depth: undefined,
    createdAt: undefined,
    leagueId: team.leagueId,
    updatedAt: undefined,
    batting: undefined,
    throwing: undefined,
    birthDate: undefined,
    birthPlace: undefined,
    shot: undefined,
    salary: undefined,
    espnPlayerId: playerID,
  };

  return playerData;
};

export const handleNbaPlayerRow: (
  playerRow: Element,
  positionGroup: string,
  team: ScrapedTeam
) => ScrapedPlayer = (playerRow, positionGroup, team) => {
  const tds = playerRow.querySelectorAll("td");
  const playerImageSection = tds[0].querySelector(
    "div.headshot div.Image__Wrapper"
  );
  const playerUrl = tds[1].querySelector("a").href;
  const playerID = getPlayerID(playerUrl);
  const playerImage = playerImageSection.querySelector("img").alt;
  const playerData: ScrapedPlayer = {
    id: undefined,
    teamId: team.id,
    playerImageSrc: playerImage,
    playerUrl,
    name: tds[1].querySelector("a").textContent,
    number: tds[1].querySelector("span.pl2")?.textContent ?? "",
    pos: tds[2].querySelector("div").textContent as Pos,
    age: tds[3].querySelector("div").textContent,
    height: tds[4].querySelector("div").textContent,
    weight: tds[5].querySelector("div").textContent,
    experience: undefined,
    college: tds[6].querySelector("div").textContent,
    positionGroup,
    playerDepthPosition: [],
    injuryStatus: undefined,
    depth: undefined,
    createdAt: undefined,
    leagueId: team.leagueId,
    updatedAt: undefined,
    batting: undefined,
    throwing: undefined,
    birthDate: undefined,
    birthPlace: undefined,
    shot: undefined,
    salary: tds[7].querySelector("div").textContent,
    espnPlayerId: playerID,
  };

  return playerData;
};
export const handleMlbPlayerRow: (
  playerRow: Element,
  positionGroup: string,
  team: ScrapedTeam
) => ScrapedPlayer = (playerRow, positionGroup, team) => {
  const tds = playerRow.querySelectorAll("td");
  const playerImageSection = tds[0].querySelector(
    "div.headshot div.Image__Wrapper"
  );
  const playerUrl = tds[1].querySelector("a").href;
  const playerID = getPlayerID(playerUrl);
  const playerImage = playerImageSection.querySelector("img").alt;
  const playerData: ScrapedPlayer = {
    id: undefined,
    teamId: team.id,
    playerImageSrc: playerImage,
    playerUrl,
    name: tds[1].querySelector("a").textContent,
    number: tds[1].querySelector("span.pl2")?.textContent ?? "",
    pos: tds[2].querySelector("div").textContent as Pos,
    age: tds[5].querySelector("div").textContent,
    height: tds[6].querySelector("div").textContent,
    weight: tds[7].querySelector("div").textContent,
    experience: undefined,
    college: undefined,
    positionGroup,
    playerDepthPosition: [],
    injuryStatus: undefined,
    depth: undefined,
    createdAt: undefined,
    leagueId: team.leagueId,
    updatedAt: undefined,
    batting: tds[3].querySelector("div").textContent,
    throwing: tds[4].querySelector("div").textContent,
    birthDate: undefined,
    birthPlace: tds[8].querySelector("div").textContent,
    shot: undefined,
    salary: undefined,
    espnPlayerId: playerID,
  };

  return playerData;
};

export const handleNhlPlayerRow: (
  playerRow: Element,
  positionGroup: string,
  team: ScrapedTeam
) => ScrapedPlayer = (playerRow, positionGroup, team) => {
  const tds = playerRow.querySelectorAll("td");
  const playerImageSection = tds[0].querySelector(
    "div.headshot div.Image__Wrapper"
  );
  const playerUrl = tds[1].querySelector("a").href;
  const playerID = getPlayerID(playerUrl);
  const playerImage = playerImageSection.querySelector("img").alt;
  const playerData: ScrapedPlayer = {
    id: undefined,
    teamId: team.id,
    playerImageSrc: playerImage,
    playerUrl,
    name: tds[1].querySelector("a").textContent,
    number: tds[1].querySelector("span.pl2")?.textContent ?? "",
    pos: undefined,
    age: tds[2].querySelector("div").textContent,
    height: tds[3].querySelector("div").textContent,
    weight: tds[4].querySelector("div").textContent,
    experience: undefined,
    college: undefined,
    positionGroup,
    playerDepthPosition: [],
    injuryStatus: undefined,
    depth: undefined,
    createdAt: undefined,
    leagueId: team.leagueId,
    updatedAt: undefined,
    batting: undefined,
    throwing: undefined,
    birthDate: tds[7].querySelector("div").textContent,
    birthPlace: tds[6].querySelector("div").textContent,
    shot: tds[5].querySelector("div").textContent,
    salary: undefined,
    espnPlayerId: playerID,
  };

  return playerData;
};

export const handleDepthChartRow: (
  pr: Element,
  t: ScrapedTeam & {
    players: ScrapedPlayer[];
  },
  tableIDX: number,
  tablesArray: NodeListOf<Element>,
  wrSet?: number
) => ScrapedTeam = (pr, t, tableIDX, tablesArray, wrSet) => {
  const td = pr.querySelectorAll(".Table__TD");
  let depth = 0;
  td.forEach((p) => {
    let pl = p.querySelector("a");
    if (pl) {
      const playerUrl = pl.href;
      const playerID = getPlayerID(playerUrl);
      const playerName = pl.textContent;
      const player = t.players.find((play) => {
        return play.espnPlayerId === playerID;
      });

      if (player) {
        const idx = parseInt(
          pl.parentElement.parentElement.parentElement.dataset.idx ?? ""
        );
        const positionTable = tablesArray[tableIDX - 1];
        const posTableRows = positionTable.querySelectorAll("tr");
        const rowDepthPositions = [];
        posTableRows.forEach((tr) => {
          const secondaryPosition = tr
            .querySelector(".Table__TD")
            .textContent.trim();
          const count = rowDepthPositions.filter((r) => {
            const output = r.replace(/[0-9]/g, "");
            return output === secondaryPosition;
          }).length;
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
          .querySelector(".nfl-injuries-status")
          .textContent.trim();
        player.injuryStatus = status as Status;
        if (!player.depth) {
          player.depth = depth;
        }
      } else {
        const newPlayer: ScrapedPlayer = {
          id: undefined,
          teamId: t.id,
          playerImageSrc:
            "https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png",
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
          pl.parentElement.parentElement.parentElement.dataset.idx ?? ""
        );
        const positionTable = tablesArray[tableIDX - 1];
        const posTableRows = positionTable.querySelectorAll("tr");
        const rowDepthPositions = [];
        posTableRows.forEach((tr) => {
          const secondaryPosition = tr
            .querySelector(".Table__TD")
            .textContent.trim();
          const count = rowDepthPositions.filter(
            (r) => r === secondaryPosition
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
          .querySelector(".nfl-injuries-status")
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

export const handleGameRow: (
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

export const getPlayerID = (url: string) => {
  const x = url.split("/");
  const index = x.findIndex((s) => s === "id");
  if (index >= 0) {
    return x[index + 1];
  }
};
