import { Request, Response } from "express";
import playerServices from "../services/player/player.services";
import { rollDices } from "../helpers/dices";
import gameServices from "../services/game/game.services";

class GameController {
  /**
   * POST /games/{id}: Realiza un nuevo juego para un jugador específico.
   */
  public async playGame(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idNum = parseInt(id);
      console.log(`id [${id}]`);
      const player = await playerServices.findPlayerById(id);

      console.log(req.params, "req params");
      console.log(player);
      if (!player) {
        res.status(404).json({ message: "Jugador no encontrado" });
        return;
      }

      //Utilizar rollDice para obtener el valor de los dados y su resultado
      const { dice1, dice2, gameResult } = rollDices();

      // Crear una nueva instancia de Game, asociándola al jugador con el ID proporcionado
      const newGame = await gameServices.createGame(
        idNum,
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
      const { id } = req.params;
      const player = await playerServices.findPlayerById(id);

      if (!player) {
        res.status(404).json({ message: "Jugador no encontrado" });
        return;
      }

      // Eliminar todos los juegos asociados al jugador especificado
      const result = await gameServices.deleteGamesByPlayerId(id);
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
      const { id } = req.params;

      const player = await playerServices.findPlayerById(id);

      if (!player) {
        res.status(404).json({ message: "Jugador no encontrado" });
        return;
      }

      // Buscar todos los juegos asociados al jugador con el ID especificado
      const games = await gameServices.findGamesByPlayerId(id);
      res.status(200).json(games);
    } catch (error) {
      console.log(error, "error games");
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

// Exportar la instancia del controlador
export default new GameController();
