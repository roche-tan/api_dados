import Player from "../../../models/player.model.sql";
import PlayerRepository from "../../../repositories/sql/player.repository";

// Mock de Sequelize findByPk
jest.mock("../../../models/player.model.sql", () => ({
  findByPk: jest.fn()
}));

describe("PlayerRepository - findPlayerById", () => {
  it("debería encontrar un jugador por ID", async () => {
    // Configura el mock para devolver un jugador específico
    const mockPlayer = {
      id: 1,
      name: "Juan Perez",
      register_date: new Date()
    };
    // Configura el mock para que findByPk devuelva el jugador
    (Player.findByPk as jest.Mock).mockResolvedValue(mockPlayer);

    // Llama al método que estás probando
    const player = await new PlayerRepository().findPlayerById("1");

    // Verifica que el resultado sea el esperado
    expect(player).toEqual(mockPlayer);
    // Verifica que findByPk fue llamado con el ID correcto
    expect(Player.findByPk).toHaveBeenCalledWith("1");
  });
});
