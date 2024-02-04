import PlayerRepository from "../../../repositories/sql/player.repository";
import Player from "../../../models/player.model.sql";

jest.mock("../../../models/player.model.sql");

describe("PlayerRepository", () => {
  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockCreate = jest.fn();
    (Player.create as jest.Mock) = mockCreate;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("createPlayer", () => {
    it("should create a new player", async () => {
      mockCreate.mockResolvedValue({ name: "playerName" });

      const newPlayer = await new PlayerRepository().createPlayer();

      expect(newPlayer.name).toBe("playerName");
    });

    it("should create an anonymous player if no name is provided", async () => {
      mockCreate.mockResolvedValue({ name: "ANÓNIMO" });

      const player = await new PlayerRepository().createPlayer();

      expect(player.name).toEqual("ANÓNIMO");
      expect(mockCreate).toHaveBeenCalledWith({ name: "ANÓNIMO" });
    });

    it("should throw an error if the name is in use", async () => {
      const playerRepo = new PlayerRepository();
      jest.spyOn(playerRepo, "_isNameInUse").mockResolvedValueOnce(true);

      await expect(playerRepo.createPlayer("testName")).rejects.toThrow("El nombre ya está en uso por otro jugador");

      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});
