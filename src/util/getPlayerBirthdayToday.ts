import { ScrapedGame, ScrapedPlayer } from "@prisma/client";

const findPlayersWithBirthdayAndGameToday = (
  players: ScrapedPlayer[],
  games: ScrapedGame[]
) => {
  const currentDate = new Date();

  const playersWithBirthdayAndGame = players.filter((player) => {
    // Check if player's birthday is today
    const playerBirthday = new Date(player.birthDate);
    if (
      playerBirthday.getMonth() === currentDate.getMonth() &&
      playerBirthday.getDate() === currentDate.getDate()
    ) {
      // Check if player has a game today
      const playerTeamId = player.teamId;
      const hasGameToday = games.some(
        (game) =>
          game.homeTeamId === playerTeamId || game.awayTeamId === playerTeamId
      );

      return hasGameToday;
    }

    return false;
  });

  return playersWithBirthdayAndGame;
};
