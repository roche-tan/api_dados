import Player from "../../../models/player.model.sql";
import PlayerRepository from "../../../services/player/player.services";

jest.mock("../../../models/player.model.sql"); // Asegúrate de que la ruta sea correcta

describe("PlayerRepository", () => {
  // Restablece todos los mocks después de cada prueba
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("updatePlayerName", () => {
    it("debería actualizar el nombre del jugador si no está en uso y el jugador existe", async () => {
      const playerId = "1";
      const newName = "NuevoNombre";
      const oldName = "NombreAntiguo";

      // Simular que el nombre no está en uso
      jest.spyOn(PlayerRepository, "_isNameInUse").mockResolvedValueOnce(false);

      // Simular que encontramos el jugador
      const mockPlayer = { id: playerId, name: oldName, save: jest.fn() };
      (Player.findByPk as jest.Mock).mockResolvedValue(mockPlayer);

      // Llamar al método a probar
      await PlayerRepository.updatePlayerName(playerId, newName);

      // Verificar que se cambió el nombre y se guardó el jugador
      expect(mockPlayer.name).toBe(newName);
      expect(mockPlayer.save).toHaveBeenCalled();
    });

    it("debería lanzar un error si el nuevo nombre está en uso", async () => {
      const playerId = "1";
      const newName = "NombreEnUso";

      // Simular que el nombre nuevo ya está en uso
      jest.spyOn(PlayerRepository, "_isNameInUse").mockResolvedValueOnce(true);

      // Probar que se lanza un error
      await expect(PlayerRepository.updatePlayerName(playerId, newName)).rejects.toThrow("El nombre ya está en uso por otro jugador");
    });

    it("debería lanzar un error si el jugador no existe", async () => {
      const playerId = "idInexistente";
      const newName = "NuevoNombre";

      // Simular que no encontramos al jugador
      (Player.findByPk as jest.Mock).mockResolvedValue(null);

      // Probar que se lanza un error
      await expect(PlayerRepository.updatePlayerName(playerId, newName)).rejects.toThrow("Jugador no encontrado");
    });
  });
});
