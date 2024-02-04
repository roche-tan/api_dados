import { Request, Response } from "express";
import PlayerRepositorySQL from "../repositories/sql/player.repository";
import PlayerRepositoryMongo from "../repositories/mongo/player.repository";
import config from "../config";
class RankingController {
  private playerRepository: PlayerRepositoryMongo | PlayerRepositorySQL | undefined = undefined;;

  constructor() {
    this.getRanking = this.getRanking.bind(this);
    this.getLoser = this.getLoser.bind(this);
    this.getWinner = this.getWinner.bind(this);
    this.getSortAllPlayersWithWinPercentage =
      this.getSortAllPlayersWithWinPercentage.bind(this);
    if (config.database === "mongo") {
      this.playerRepository = new PlayerRepositoryMongo();
    } else if (config.database === "sql") {
      this.playerRepository = new PlayerRepositorySQL();
    }
  }

  private async getSortAllPlayersWithWinPercentage(
    playersWithWinPercentage: any[]
  ) {
    return playersWithWinPercentage.sort(
      (a, b) => b.winPercentage - a.winPercentage
    );
  }

  // GET /ranking: devuelve un ranking de jugadores/as ordenado por porcentaje de logros y el porcentaje de logros medio del conjunto de todos los jugadores/as.

  public async getRanking(req: Request, res: Response): Promise<void> {
    try {
      if (!this.playerRepository) {
        throw new Error("Player repository is not initialized");
      }

      const playersWithWinPercentage =
        await this.playerRepository.getAllPlayersWithWinPercentage();

      const sortPlayersWithWinPercentage =
        await this.getSortAllPlayersWithWinPercentage(playersWithWinPercentage);

      const averageSuccessRate =
        sortPlayersWithWinPercentage.reduce(
          (acc, curr) => acc + curr.winPercentage,
          0
        ) / (sortPlayersWithWinPercentage.length || 1);
      res
        .status(200)
        .json({ sortPlayersWithWinPercentage, averageSuccessRate });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  // GET /ranking/loser: devuelve al jugador/a con peor porcentaje de éxito.
  public async getLoser(req: Request, res: Response): Promise<void> {
    try {
      if (!this.playerRepository) {
        throw new Error("Player repository is not initialized");
      }
      const playersWithWinPercentage =
        await this.playerRepository.getAllPlayersWithWinPercentage();

      const sortPlayersWithWinPercentage =
        await this.getSortAllPlayersWithWinPercentage(playersWithWinPercentage);

      const loser =
        sortPlayersWithWinPercentage[sortPlayersWithWinPercentage.length - 1] ||
        null;

      res.status(200).json({ loser });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  //  GET /ranking/winner: devuelve al jugador/a con mejor porcentaje de éxito.
  public async getWinner(req: Request, res: Response): Promise<void> {
    try {
      if (!this.playerRepository) {
        throw new Error("Player repository is not initialized");
      }
      const playersWithWinPercentage =
        await this.playerRepository.getAllPlayersWithWinPercentage();

      const sortPlayersWithWinPercentage =
        await this.getSortAllPlayersWithWinPercentage(playersWithWinPercentage);

      const winner = sortPlayersWithWinPercentage[0] || null;
      res.json({ winner });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
export default new RankingController();