import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/config.sql";

class Player extends Model {
  public id!: number;
  public name!: string;
  public register_date!: Date;

  static associate(models: any) {
    console.log(typeof models);
    Player.hasMany(models.Game, { foreignKey: "player_id" });
  }
}

Player.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is required"
        },
        notEmpty: {
          msg: "Name is required"
        }
      }
    },
    register_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      field: "updated_at",
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  { sequelize, modelName: "Player", tableName: "player", timestamps: true } // sequelize crea las columnas createdAt y updatedAt auomaticamente, para eliminarlas: timestamps:false
);

export default Player;
