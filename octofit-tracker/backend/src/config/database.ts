import mongoose from 'mongoose';

export const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db';

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(MONGODB_URI);
};
