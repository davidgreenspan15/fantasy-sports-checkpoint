import { createFantasyProsPlayers } from "../models/fantasaySportsData";
import { listScrapedFootballTeamsWithPlayers } from "../models/scrapedTeams";
import { csvConverter } from "../services/fantasyProsCsv/converter";

export const convertFpsData = async () => {
  const teams = await listScrapedFootballTeamsWithPlayers();
  const fpsData = await csvConverter.getFantasyProsDataCSV(teams);
  const ps = await createFantasyProsPlayers(fpsData);
  return ps;
};
