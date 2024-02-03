import Player from "../../../models/player.model.sql";
import playerServices from "../../../services/player/player.services";
import GameRepository from "../../../services/game/game.services";

jest.mock("../../../models/player.model.sql", () => {
  const mockSequelizeModel = {
    findAll: jest.fn(),
    // otros métodos que necesites mockear
  };
  return {
    __esModule: true, // Para mocks de ES modules. sino no deja utilizar mock de Player
    default: mockSequelizeModel, // Usa 'default' para la exportación por defecto
  };
});

jest.mock("../../../services/game/game.services", () => ({
  findGamesByPlayerId: jest.fn(),
}));

describe("getAllPlayersWithWinPercentage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configura el mock para Player.findAll
    (Player.findAll as jest.Mock).mockResolvedValue([
      { id: 1, get: jest.fn(() => ({ id: 1, name: "Jugador 1" })) },
      { id: 2, get: jest.fn(() => ({ id: 2, name: "Jugador 2" })) },
    ]);

    // Configura el mock para GameRepository
    (GameRepository.findGamesByPlayerId as jest.Mock).mockImplementation(
      (playerId) => {
        switch (playerId) {
          case "1":
            return Promise.resolve([{ result: true }, { result: false }]);
          case "2":
            return Promise.resolve([{ result: true }]);
          default:
            return Promise.resolve([]);
        }
      }
    );
  });

  it("debe devolver jugadores con sus porcentajes de victorias", async () => {
    const playersWithWinPercentage =
      await playerServices.getAllPlayersWithWinPercentage();

    expect(playersWithWinPercentage).toEqual([
      { id: 1, name: "Jugador 1", winPercentage: 50.0 },
      { id: 2, name: "Jugador 2", winPercentage: 100.0 },
    ]);

    // Verifica que los métodos mockeados hayan sido llamados correctamente
    expect(Player.findAll).toHaveBeenCalled();
    expect(GameRepository.findGamesByPlayerId).toHaveBeenCalledWith("1");
    expect(GameRepository.findGamesByPlayerId).toHaveBeenCalledWith("2");
    // Verifica llamadas para otros IDs de jugadores si configuraste más
  });
});
