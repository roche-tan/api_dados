import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/config.sql";

class Game extends Model {
  public id!: number;
  public player_id!: number; // Referencia al ID del jugador en SQL
  public dice1!: number;
  public dice2!: number;
  public result!: boolean;
  public createdAt!: Date;

  static associate(models: any) {
    Game.belongsTo(models.Player, { foreignKey: "id" });
  }
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Player", // Nombre del modelo de 'Player' en Sequelize
        key: "id",
      },
    },
    dice1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 6,
      },
    },
    dice2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 6,
      },
    },
    result: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      field: "updated_at",
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Game",
    tableName: "game",
    timestamps: true, // Si no quieres que Sequelize maneje automáticamente las columnas createdAt y updatedAt
  }
);

export default Game;
