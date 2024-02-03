import express, { Application } from "express";
import cors from "cors";
import config from "../config";

// import { connectDB } from "../db/config.mongo";
import { connectDBMySQL } from "../db/config.sql";

import routerGames from "../routes/game.routes";
import routerPlayers from "../routes/players.routes";
import routerRanking from "../routes/ranking.routes";
import routerError404 from "../routes/error404.routes";

const logger = (req: any, _res: any, next: any) => {
  console.log(`
      ${req.method} 
      ${req.url} 
      ${req.ip}`);
  next();
};

class Server {
  private app: Application;
  private port: string | number;
  private path = {
    games: "/games",
    players: "/players",
    ranking: "/ranking",
    error404: "*"
  };

  constructor() {
    this.app = express();
    this.port = config.port;

    this.dbConnect();
    this.middlewares();
    this.routes();
    this.listen();
  }

  async dbConnect() {
    // await connectDB(); // Conexión a MongoDB
    await connectDBMySQL(); // Conexión a MySQL
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(logger);
  }

  routes() {
    this.app.use(this.path.games, routerGames);
    this.app.use(this.path.players, routerPlayers);
    this.app.use(this.path.ranking, routerRanking);
    this.app.use(this.path.error404, routerError404);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}...`);
    });
  }
 
}

export default Server;
