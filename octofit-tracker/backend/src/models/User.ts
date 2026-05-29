import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  team?: Schema.Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
});

export default model<IUser>('User', UserSchema);
