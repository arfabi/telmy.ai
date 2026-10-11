import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initFirebase } from './config/firebase.js';
import explainRoutes from './routes/explain.js';
import feedbackRoutes from './routes/feedback.js';
import dictionaryRoutes from './routes/dictionary.js';
import voiceRoutes from './routes/voice.js';
import chatRoutes from './routes/chat.js';
import translateRoutes from './routes/translate.js';
import userRoutes from './routes/user.js';
import pdfRoutes from './routes/pdf.js';
import paymentRoutes from './routes/payment.js';

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
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

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
    aiProvider: 'gemini',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    googleTtsConfigured: Boolean(process.env.GOOGLE_TTS_API_KEY || process.env.GEMINI_API_KEY)
  });
});

// Dynamic Firebase Web Client Config (Supports self-hosting & multi-environment deployment)
app.get('/firebase-config.js', (req, res) => {
  res.type('application/javascript');
  const clientConfig = {
    apiKey: process.env.FIREBASE_WEB_API_KEY || process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || (process.env.FIREBASE_PROJECT_ID ? `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com` : ''),
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || (process.env.FIREBASE_PROJECT_ID ? `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app` : ''),
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || ''
  };
  res.send(`window.__FIREBASE_CONFIG__ = ${JSON.stringify(clientConfig)};`);
});

app.get('/api/config', (req, res) => {
  res.json({
    service: 'Telmy.ai',
    version: '1.0.0',
    firebase: {
      apiKey: process.env.FIREBASE_WEB_API_KEY || process.env.FIREBASE_API_KEY || '',
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || (process.env.FIREBASE_PROJECT_ID ? `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com` : ''),
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || (process.env.FIREBASE_PROJECT_ID ? `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app` : ''),
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.FIREBASE_APP_ID || ''
    }
  });
});

// Serve Static Web Platform (Landing Page, Privacy, Demo, Download)
const publicDir = path.resolve(__dirname, '../public');
app.use(express.static(publicDir));

// Clean URLs
app.get('/', (req, res) => res.sendFile(path.join(publicDir, 'index.html')));
app.get('/privacy', (req, res) => res.sendFile(path.join(publicDir, 'privacy.html')));
app.get('/demo', (req, res) => res.sendFile(path.join(publicDir, 'demo.html')));
app.get('/download', (req, res) => res.sendFile(path.join(publicDir, 'download.html')));
app.get('/connect', (req, res) => res.sendFile(path.join(publicDir, 'connect.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(publicDir, 'dashboard.html')));

// API Routes
app.use('/api', explainRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', dictionaryRoutes);
app.use('/api', voiceRoutes);
app.use('/api', chatRoutes);
app.use('/api', translateRoutes);
app.use('/api', userRoutes);
app.use('/api', pdfRoutes);
app.use('/api', paymentRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 [Telmy.ai Server] Running on http://localhost:${PORT}`);
  console.log(`📡 Cloud Run Ready | Health check: http://localhost:${PORT}/health`);
  console.log(`🔥 Firebase Firestore Status: ${isFirebaseConnected ? 'CONNECTED' : 'DISCONNECTED / OFFLINE MODE'}`);
  console.log(`🤖 Primary AI Provider: Google Gemini (${process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'})`);
  console.log(`🎙️ Voice Engine: Google Cloud TTS WaveNet`);
});
