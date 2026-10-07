import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;
let isFirebaseConnected = false;

export function initFirebase() {
  if (db) return { db, isFirebaseConnected };

  try {
    // 1. Check if serviceAccountKey.json exists locally
    const defaultKeyPath = path.resolve(__dirname, '../../serviceAccountKey.json');
    const envKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS 
      ? path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS)
      : null;

    const keyPath = (envKeyPath && fs.existsSync(envKeyPath)) 
      ? envKeyPath 
      : (fs.existsSync(defaultKeyPath) ? defaultKeyPath : null);

    if (keyPath) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID
      });
      db = admin.firestore();
      db.settings({ ignoreUndefinedProperties: true });
      isFirebaseConnected = true;
    } else if (process.env.NODE_ENV === 'production' || process.env.FIREBASE_PROJECT_ID) {
      // 2. Running in Cloud Run or GCP with Application Default Credentials (ADC)
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
      console.log('[Firebase] Initialized using Google Cloud ADC.');
      db = admin.firestore();
      db.settings({ ignoreUndefinedProperties: true });
      isFirebaseConnected = true;
    } else {
      console.warn('⚠️ [Firebase] serviceAccountKey.json not found in /backend root.');
      console.warn('⚠️ Running with in-memory fallback. Add serviceAccountKey.json to persist to Firestore Cloud.');
    }
  } catch (error) {
    console.error('❌ [Firebase] Error initializing Firebase Admin:', error.message);
  }

  return { db, isFirebaseConnected };
}

export function getFirestore() {
  if (!db) {
    initFirebase();
  }
  return { db, isFirebaseConnected };
}
