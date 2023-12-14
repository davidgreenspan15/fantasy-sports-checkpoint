import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  // await prisma.scrapedLeague.createMany({
  //   data: [
  //     { abr: "nfl", teamsListUrl: "https://www.espn.com/nfl/teams" },
  //     { abr: "nba", teamsListUrl: "https://www.espn.com/nba/teams" },
  //     { abr: "nhl", teamsListUrl: "https://www.espn.com/nhl/teams" },
  //     { abr: "mlb", teamsListUrl: "https://www.espn.com/mlb/teams" },
  //   ],
  // });
  await prisma.league.createMany({
    data: [
      {
        espnId: "28",
        name: "National Football League",
        abbreviation: "NFL",
        shortName: "NFL",
        slug: "nfl",
        sport: "football",
      },
    ],
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