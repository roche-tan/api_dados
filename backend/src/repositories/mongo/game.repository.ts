import Game from "../../models/game.model.mongo";

class GameRepository {
  async createGame(
    player_id: string,
    dice1: number,
    dice2: number,
    result: boolean
  ) {
    // Crea un jugador
    console.log(player_id, dice1, dice2, result, "createGame");
    const game = new Game({
      playerId: player_id,
      dice1: dice1,
      dice2: dice2,
      result: result,
    })
    await game.save();

    return game;
  }

  async findGamesByPlayerId(playerId: string) {
    console.log(`id [${playerId}]`);
    // Encontrar jugador por id
    const games = await Game.find({ playerId: playerId });
    return games;
  }

  async deleteGamesByPlayerId(playerId: string) {
    const result = await Game.deleteMany({ playerId: playerId });
    return result;
  }
}

export default GameRepository;
