import Game from "../../models/game.model.sql";

class GameRepository {
  async createGame(
    player_id: string,
    dice1: number,
    dice2: number,
    result: boolean
  ) {
    // Crea un jugador
    console.log(player_id, dice1, dice2, result, "createGame");
    const game = await Game.create({
      player_id: player_id,
      dice1: dice1,
      dice2: dice2,
      result: result,
    });

    return game;
  }

  async findGamesByPlayerId(playerId: string) {
    console.log(`id [${playerId}]`);
    // Encontrar jugador por id
    const games = await Game.findAll({ where: { player_id: playerId } });
    return games;
  }

  async deleteGamesByPlayerId(playerId: string) {
    const result = await Game.destroy({ where: { player_id: playerId } });
    return result;
  }
}

export default GameRepository;
