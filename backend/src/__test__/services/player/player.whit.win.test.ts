import Player from "../../../models/player.model.sql";
import Game from "../../../models/game.model.sql";
import GameRepository from "../../../repositories/sql/game.repository";
import PlayerRepository from "../../../repositories/sql/player.repository";

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

      const mockedGames  = [
          { id: 1, player_id: 1, dice1: 3, dice2: 4, result: true, createdAt: new Date() },
          { id: 2, player_id: 1, dice1: 1, dice2: 2, result: false, createdAt: new Date() }
        ]
      jest.spyOn(Game, "findAll").mockResolvedValue(mockedGames as []);

      // const gameRepo = new GameRepository()
      // jest.spyOn(gameRepo , "findGamesByPlayerId").mockImplementation((playerId: string) => {
      //   return Promise.resolve(mockedGames[playerId] as []);
      // });

      // Llamar al método a probar
      const playerRepo = new PlayerRepository()
      
      const result = await playerRepo.getAllPlayersWithWinPercentage();

      // Verificar resultados esperados
      expect(result).toEqual([
        { id: "1", name: "Jugador1", winPercentage: 50.0 },
        { id: "2", name: "Jugador2", winPercentage: 50.0 }
      ]);
    });
  });
});
