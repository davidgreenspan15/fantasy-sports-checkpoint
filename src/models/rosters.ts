import { Prisma } from "@prisma/client";
import { prisma } from "..";

export const upsertRosters = async (roster: Prisma.RosterCreateInput) => {
  return await prisma.roster.upsert({
    where: {
      teamId_leagueId_seasonYearDisplayNumberAndType: {
        teamId: roster.Team.connect.id,
        leagueId: roster.League.connect.id,
        seasonYearDisplayNumberAndType: roster.seasonYearDisplayNumberAndType,
      },
    },
    update: roster,
    create: roster,
  });
};
