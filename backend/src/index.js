import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initFirebase } from './config/firebase.js';
import explainRoutes from './routes/explain.js';
import feedbackRoutes from './routes/feedback.js';
import dictionaryRoutes from './routes/dictionary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firebase Admin
const { isFirebaseConnected } = initFirebase();

// Middleware
app.use(cors({
  origin: '*', // Allow extension requests and local dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint (for Cloud Run & monitoring)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Telmy.ai Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    firebaseConnected: isFirebaseConnected,
    aiProvider: process.env.AI_PROVIDER || (process.env.OPENAI_API_KEY ? 'openai' : 'gemini'),
    openAiConfigured: Boolean(process.env.OPENAI_API_KEY),
    openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    openAiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// API Routes
app.use('/api', explainRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', dictionaryRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
  const provider = (process.env.AI_PROVIDER || (process.env.OPENAI_API_KEY ? 'openai' : 'gemini')).toUpperCase();
  console.log(`🚀 [Telmy.ai Server] Running on http://localhost:${PORT}`);
  console.log(`📡 Cloud Run Ready | Health check: http://localhost:${PORT}/health`);
  console.log(`🔥 Firebase Firestore Status: ${isFirebaseConnected ? 'CONNECTED' : 'DISCONNECTED / OFFLINE MODE'}`);
  console.log(`🤖 Active AI Provider: ${provider}`);
  if (process.env.OPENAI_API_KEY) {
    console.log(`✨ OpenAI-Compat Endpoint: ${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'} (Model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'})`);
  }
  if (process.env.GEMINI_API_KEY) {
    console.log(`✨ Gemini AI Key (Fallback): CONFIGURED`);
  }
});
