import Player from "../../../models/player.model.sql";
import PlayerRepository from "../../../services/player/player.services";

describe("PlayerRepository - findPlayerByName", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("debería retornar null si el jugador no existe", async () => {
    const playerName = "NombreInexistente";

    // Usa spyOn y mockResolvedValue
    jest.spyOn(Player, "findOne").mockResolvedValue(null);

    // Llamar al método a probar
    const result = await PlayerRepository.findPlayerByName(playerName);

    // Verificar que el resultado es null
    expect(result).toBeNull();
  });

  it("debería encontrar un jugador por nombre", async () => {
    const mockPlayer = {
      id: 1,
      name: "Juan Perez",
      register_date: new Date()
    };

    // Usa spyOn y mockResolvedValue
    jest.spyOn(Player, "findOne").mockResolvedValue(mockPlayer as any);

    const playerName = "Juan Perez";

    const player = await PlayerRepository.findPlayerByName(playerName);

    expect(player).toEqual(mockPlayer);
    expect(Player.findOne).toHaveBeenCalledWith({ where: { name: playerName } });
  });
});
