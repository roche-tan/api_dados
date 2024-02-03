import { Request, Response } from "express";
import playerRepository from "../services/player/player.services";

class PlayerController {
  // POST /players: crea un jugador/a.
  public async createPlayer(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      // Crear jugador (nombrado o anónimo).
      const newPlayer = await playerRepository.createPlayer(name);

      // Responder con los detalles del jugador creado
      res.status(200).json({ name: newPlayer.name, playerId: newPlayer.id });
      console.log(`${newPlayer.name} creado como jugador`);
    } catch (error) {
      // Comprobamos si el error es una instancia de Error
      if (error instanceof Error) {
        // Manejo específico del error de nombre en uso
        if (error.message === "El nombre ya está en uso por otro jugador") {
          res.status(400).json({ message: error.message });
        } else {
          console.log("Error al crear jugador:", error.message);
          res.status(500).json({ message: "Error interno del servidor" });
        }
      } else {
        // Manejo de errores no esperados
        const errorMsg = `Error inesperado del servidor ${error}`;
        console.log(errorMsg);
        res.status(500).json({ message: errorMsg });
      }
    }
  }

  // PUT /players/{id}: modifica el nombre del jugador/a.
  public async updatePlayerName(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name || name.trim().length === 0) {
        res.status(400).json({ message: "El nombre no puede estar vacío" });
        return;
      }

      const playerName = name.trim();

      // Verificar si ya existe un jugador con el nuevo nombre y no es el mismo jugador
      const existingPlayer = await playerRepository.findPlayerByName(
        playerName
      );
      if (existingPlayer && existingPlayer.id.toString() !== id) {
        res
          .status(400)
          .json({ message: "El nombre ya está en uso por otro jugador" });
        return;
      }

      // Buscar y actualizar el nombre del jugador
      const updatedPlayer = await playerRepository.updatePlayerName(
        id,
        playerName
      );
      if (!updatedPlayer) {
        res.status(404).json({ message: "Jugador no encontrado" });
        return;
      }

      res.status(200).json(updatedPlayer);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // GET /players: devuelve el listado de todos los jugadores/as del sistema con su porcentaje de logros.
  public async getAllPlayers(req: Request, res: Response): Promise<void> {
    try {
      // Obtener todos los jugadores/as del sistema con su porcentaje de logros
      const playersWithWinPercentage =
        await playerRepository.getAllPlayersWithWinPercentage();

      // Envía la respuesta con el array de jugadores y sus porcentajes de victoria
      res.status(200).json(playersWithWinPercentage);
    } catch (error) {
      console.error("Error al obtener todos los jugadores:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

// Exportamos la instancia del controlador

export default new PlayerController();
