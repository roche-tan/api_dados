import { Request, Response } from "express";
import PlayerRepositorySQL from "../repositories/sql/player.repository";
import PlayerRepositoryMongo from "../repositories/mongo/player.repository";
import { rollDices } from "../helpers/dices";
import GameRepositorySQL from "../repositories/sql/game.repository";
import GameRepositoryMongo from "../repositories/mongo/game.repository";
import config from "../config";

class GameController {

  private gameRepository: GameRepositoryMongo | GameRepositorySQL | undefined = undefined;;
  private playerRepository: PlayerRepositoryMongo | PlayerRepositorySQL | undefined = undefined;;

  constructor() {
    this.playGame = this.playGame.bind(this);
    this.deletePlayerGames = this.deletePlayerGames.bind(this);
    this.getPlayerGames = this.getPlayerGames.bind(this);
    if (config.database === "mongo") {
      this.gameRepository = new GameRepositoryMongo();
      this.playerRepository = new PlayerRepositoryMongo();

    } else if (config.database === "sql") {
      this.gameRepository = new GameRepositorySQL();
      this.playerRepository = new PlayerRepositorySQL();

    }
  }


  /**
   * POST /games/{id}: Realiza un nuevo juego para un jugador específico.
   */
  public async playGame(req: Request, res: Response): Promise<void> {
    try {
      if (!this.playerRepository || !this.gameRepository) {
        throw new Error("Player or game repository is not initialized");
      }
      const { id } = req.params;
      console.log(`id [${id}]`);
      const player = await this.playerRepository.findPlayerById(id);

      console.log(req.params, "req params");
      console.log(player);
      if (!player) {
        res.status(404).json({ message: "Jugador no encontrado" });
        return;
      }

      //Utilizar rollDice para obtener el valor de los dados y su resultado
      const { dice1, dice2, gameResult } = rollDices();

      // Crear una nueva instancia de Game, asociándola al jugador con el ID proporcionado
      const newGame = await this.gameRepository.createGame(
        id,
        dice1,
        dice2,
        gameResult
      );
      res.status(200).json(newGame);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // /**
  //  * DELETE /games/{id}: Elimina todas las jugadas de un jugador específico.
  //  */
  public async deletePlayerGames(req: Request, res: Response): Promise<void> {
    try {
      if (!this.playerRepository || !this.gameRepository) {
        throw new Error("Player or game repository is not initialized");
      }
      const { id } = req.params;
      const player = await this.playerRepository.findPlayerById(id);

      if (!player) {
        res.status(404).json({ message: "Jugador no encontrado" });
        return;
      }

      // Eliminar todos los juegos asociados al jugador especificado
      const result = await this.gameRepository.deleteGamesByPlayerId(id);
      console.log('number of deleted rows:', result)
      res.status(200).json({ message: "Juegos eliminados con éxito" });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // /**
  //  * GET /games/{id}: Devuelve la lista de juegos realizados por un jugador específico.
  //  */
  public async getPlayerGames(req: Request, res: Response): Promise<void> {
    try {
      if (!this.playerRepository || !this.gameRepository) {
        throw new Error("Player or game repository is not initialized");
      }
      const { id } = req.params;

      const player = await this.playerRepository.findPlayerById(id);

      if (!player) {
        res.status(404).json({ message: "Jugador no encontrado" });
        return;
      }

      // Buscar todos los juegos asociados al jugador con el ID especificado
      const games = await this.gameRepository.findGamesByPlayerId(id);
      res.status(200).json(games);
    } catch (error) {
      console.log(error, "error games");
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

// Exportar la instancia del controlador
export default new GameController();
