import { prisma } from "../src/index";
async function main() {
  // await prisma.scrapedLeague.createMany({
  //   data: [
  //     { abr: "nfl", teamsListUrl: "https://www.espn.com/nfl/teams" },
  //     { abr: "nba", teamsListUrl: "https://www.espn.com/nba/teams" },
  //     { abr: "nhl", teamsListUrl: "https://www.espn.com/nhl/teams" },
  //     { abr: "mlb", teamsListUrl: "https://www.espn.com/mlb/teams" },
  //   ],
  // });
  // await prisma.league.createMany({
  //   data: [
  //     {
  //       espnId: "28",
  //       name: "National Football League",
  //       abbreviation: "NFL",
  //       shortName: "NFL",
  //       slug: "nfl",
  //       sport: "football",
  //     },
  //     {
  //       espnId: "46",
  //       name: "National Basketball Association",
  //       abbreviation: "NBA",
  //       shortName: "NBA",
  //       slug: "nba",
  //       sport: "basketball",
  //     },
  //     {
  //       espnId: "10",
  //       name: "Major League Baseball",
  //       abbreviation: "MLB",
  //       shortName: "MLB",
  //       slug: "mlb",
  //       sport: "baseball",
  //     },
  //     {
  //       espnId: "90",
  //       name: "National Hockey League",
  //       abbreviation: "NHL",
  //       shortName: "NHL",
  //       slug: "nhl",
  //       sport: "hockey",
  //     },
  //   ],
  //   skipDuplicates: true,
  // });
  await prisma.year.update({
    where: { year: 2023 },
    data: {
      Seasons: {
        createMany: {
          data: [
            { name: "Preseason", type: 1 },
            { name: "Regular Season", type: 2 },
            { name: "Postseason", type: 3 },
            { name: "Offseason", type: 4 },
          ],
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
