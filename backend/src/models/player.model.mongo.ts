import mongoose, { Document, Schema } from 'mongoose';

interface IPlayer extends Document {
  id: number;
  name: string;
  register_date: Date;
}

const PlayerSchema: Schema = new Schema({
  name: { type: String, required: true },
  register_date: { type: Date, default: Date.now },
});

const Player = mongoose.model<IPlayer>('Player', PlayerSchema);

export default Player;
