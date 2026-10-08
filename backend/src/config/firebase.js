import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;
let isFirebaseConnected = false;

let storage = null;
let auth = null;

export function initFirebase() {
  if (db) return { db, storage, auth, isFirebaseConnected };

  try {
    // 1. Check if serviceAccountKey.json exists locally
    const defaultKeyPath = path.resolve(__dirname, '../../serviceAccountKey.json');
    const envKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS 
      ? path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS)
      : null;

    const keyPath = (envKeyPath && fs.existsSync(envKeyPath)) 
      ? envKeyPath 
      : (fs.existsSync(defaultKeyPath) ? defaultKeyPath : null);

    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || (process.env.FIREBASE_PROJECT_ID ? `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app` : undefined);

    if (keyPath) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      const projectId = serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID;
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || (projectId ? `${projectId}.firebasestorage.app` : undefined)
      });
      db = admin.firestore();
      db.settings({ ignoreUndefinedProperties: true });
      storage = admin.storage();
      auth = admin.auth();
      isFirebaseConnected = true;
    } else if (process.env.NODE_ENV === 'production' || process.env.FIREBASE_PROJECT_ID) {
      // 2. Running in Firebase Functions / Cloud Run / GCP with Application Default Credentials (ADC)
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket
      });
      console.log('[Firebase] Initialized using Google Cloud ADC.');
      db = admin.firestore();
      db.settings({ ignoreUndefinedProperties: true });
      storage = admin.storage();
      auth = admin.auth();
      isFirebaseConnected = true;
    } else {
      console.warn('⚠️ [Firebase] serviceAccountKey.json not found in /backend root.');
      console.warn('⚠️ Running with in-memory fallback. Add serviceAccountKey.json to persist to Firestore Cloud.');
    }
  } catch (error) {
    console.error('❌ [Firebase] Error initializing Firebase Admin:', error.message);
  }

  return { db, storage, auth, isFirebaseConnected };
}

export function getFirestore() {
  if (!db) {
    initFirebase();
  }
  return { db, isFirebaseConnected };
}

export function getStorage() {
  if (!storage) {
    initFirebase();
  }
  return { storage, isFirebaseConnected };
}

export function getAuth() {
  if (!auth) {
    initFirebase();
  }
  return { auth, isFirebaseConnected };
}
