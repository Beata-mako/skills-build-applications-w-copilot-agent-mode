import { Schema, model, Document } from 'mongoose';

export interface IActivity extends Document {
  user: Schema.Types.ObjectId;
  type: string;
  duration: number;
  calories: number;
  date: Date;
}

const ActivitySchema = new Schema<IActivity>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  calories: { type: Number, required: true },
  date: { type: Date, required: true },
});

export default model<IActivity>('Activity', ActivitySchema);
