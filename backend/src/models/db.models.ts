import { sequelize } from "../db/config.sql";
import Player from "../models/player.model.sql";
import Game from "../models/game.model.sql";

const associateModels = () => {
  Player.associate({ Game });
  Game.associate({ Player }); // Descomentar si Game tiene asociaciones definidas
};

const syncModels = async () => {
  try {
    await sequelize.sync({ force: false });
    associateModels();
    console.log("Models synchronized and associations created.");
  } catch (error) {
    console.error("Error during model synchronization:", error);
  }
};

export default syncModels;
