import Player from "../../models/player.model.sql";
import GameRepository from "../../services/game/game.services";

class PlayerRepository {
  // Método privado para verificar si el nombre está en uso
  async _isNameInUse(name: string, excludePlayerId?: string) {
    const existingPlayer = await Player.findOne({ where: { name } });
    return existingPlayer && existingPlayer.id.toString() !== excludePlayerId;
  }

  // 1- Método para crear un jugador con un nombre o "ANÓNIMO"
  async createPlayer(name?: string) {
    // Si no se proporciona nombre, se usará "ANÓNIMO"
    const playerName = name?.trim() || "ANÓNIMO";

    // Verificar si el nombre ya está en uso (solo para jugadores no anónimos)
    if (playerName !== "ANÓNIMO" && (await this._isNameInUse(playerName))) {
      throw new Error("El nombre ya está en uso por otro jugador");
    }
    // Crear y retornar el jugador (nombrado o anónimo)
    return await Player.create({ name: playerName });
  }

  // 2- Método para encontrar un jugador por nombre
  async findPlayerByName(name: string) {
    const player = await Player.findOne({ where: { name } });
    return player;
  }

  // 3- Método para encontrar un jugador por id
  async findPlayerById(id: string) {
    const player = await Player.findByPk(id);
    return player;
  }

  // 4- Método para buscar y actualizar el nombre de un jugador
  async updatePlayerName(playerId: string, newName: string) {
    const playerName = newName.trim();
    // Verificar si ya existe un jugador con el nuevo nombre y no es el mismo jugador
    if (await this._isNameInUse(playerName, playerId)) {
      throw new Error("El nombre ya está en uso por otro jugador");
    }
    // Buscar y actualizar el nombre del jugador
    const player = await Player.findByPk(playerId);
    if (!player) {
      throw new Error("Jugador no encontrado");
    }

    player.name = playerName;
    await player.save();
    return player;
  }

  async getAllPlayersWithWinPercentage() {
    // Obtener todos los jugadores
    const players = await Player.findAll();

    // Obtener los juegos de cada jugador
    const playersWithWinPercentage = await Promise.all(
      players.map(async player => {
        // Usa GameRepository para obtener los juegos del jugador
        const games = (await GameRepository.findGamesByPlayerId(player.id.toString())) || [];
        const wins = games.filter(game => game.result).length;
        const totalGames = games.length;
        const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;

        // Agrega la información de winPercentage al objeto del jugador
        return {
          ...player.get({ plain: true }), // Convierte el modelo de Sequelize a un objeto simple
          winPercentage: parseFloat(winPercentage.toFixed(2)) // Asegura que el porcentaje sea un número flotante
        };
      })
    );

    return playersWithWinPercentage;
  }
}

export default new PlayerRepository();
