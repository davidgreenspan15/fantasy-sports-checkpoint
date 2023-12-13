import { Prisma, ScrapedPlayer } from "@prisma/client";

import jsdom from "jsdom";
import axios from "axios";

export const scrapeMorePlayerInfoForAllPlayers: (
  players: ScrapedPlayer[]
) => Promise<Prisma.ScrapedPlayerUpdateManyMutationInput[]> = async (
  players
) => {
  const response = await Promise.all(
    players.map(async (p) => {
      const res = await scrapeMorePlayerInfo(p);
      return res;
    })
  );
  return response;
};

export const scrapeMorePlayerInfo: (
  player: ScrapedPlayer
) => Promise<Prisma.ScrapedPlayerUpdateManyMutationInput> = async (player) => {
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
};
