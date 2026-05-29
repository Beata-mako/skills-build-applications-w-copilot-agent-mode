import { Schema, model, Document } from 'mongoose';

export interface ILeaderboard extends Document {
  user: Schema.Types.ObjectId;
  score: number;
  rank: number;
}

const LeaderboardSchema = new Schema<ILeaderboard>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  rank: { type: Number, required: true },
});

export default model<ILeaderboard>('Leaderboard', LeaderboardSchema);
