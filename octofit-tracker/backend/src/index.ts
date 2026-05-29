import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 8000;

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'octofit-backend',
    baseUrl,
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri);
    // Start API only after DB connection is ready.
    app.listen(port, () => {
      console.log(`OctoFit backend listening on ${baseUrl}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

void startServer();
