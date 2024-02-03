import Player from "../../../models/player.model.sql";
import Game from "../../../models/game.model.sql";
import GameRepository from "../../../services/game/game.services";
import PlayerRepository from "../../../services/player/player.services";

describe("PlayerRepository", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAllPlayersWithWinPercentage", () => {
    it("debería retornar todos los jugadores con su porcentaje de victorias", async () => {
      // Simulando la respuesta de Player.findAll
      const mockedPlayers = [
        { id: "1", name: "Jugador1", get: () => ({ id: "1", name: "Jugador1" }) },
        { id: "2", name: "Jugador2", get: () => ({ id: "2", name: "Jugador2" }) }
      ];
      jest.spyOn(Player, "findAll").mockResolvedValue(mockedPlayers as []);

      // Simulando la respuesta de GameRepository.findGamesByPlayerId
      interface Game {
        id: number;
        player_id: number;
        dice1: number;
        dice2: number;
        result: boolean;
        createdAt: Date;
      }

      const mockedGames: { [key: string]: Game[] } = {
        "1": [
          { id: 1, player_id: 1, dice1: 3, dice2: 4, result: true, createdAt: new Date() },
          { id: 2, player_id: 1, dice1: 1, dice2: 2, result: false, createdAt: new Date() }
        ],
        "2": [
          { id: 3, player_id: 2, dice1: 5, dice2: 6, result: true, createdAt: new Date() },
          { id: 4, player_id: 2, dice1: 4, dice2: 3, result: true, createdAt: new Date() }
        ]
      };
      jest.spyOn(GameRepository, "findGamesByPlayerId").mockImplementation((playerId: string) => {
        return Promise.resolve(mockedGames[playerId] as []);
      });

      // Llamar al método a probar
      const result = await PlayerRepository.getAllPlayersWithWinPercentage();

      // Verificar resultados esperados
      expect(result).toEqual([
        { id: "1", name: "Jugador1", winPercentage: 50.0 },
        { id: "2", name: "Jugador2", winPercentage: 100.0 }
      ]);
    });
  });
});
