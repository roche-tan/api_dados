import mongoose, { Document, Schema } from 'mongoose';

interface IGame extends Document {
  dice1: number;
  dice2: number;
  playerId: string;
  createdAt: Date;
  result: boolean;
}

const GameSchema: Schema = new Schema({
  dice1: { type: Number, required: true },
  dice2: { type: Number, required: true },
  playerId: { type: String, required: true },
  result: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});


const Game = mongoose.model<IGame>('Game', GameSchema);

export default Game;
