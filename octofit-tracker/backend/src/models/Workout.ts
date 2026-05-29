import { Schema, model, Document } from 'mongoose';

export interface IWorkout extends Document {
  name: string;
  description: string;
  difficulty: string;
  duration: number;
}

const WorkoutSchema = new Schema<IWorkout>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  duration: { type: Number, required: true },
});

export default model<IWorkout>('Workout', WorkoutSchema);
