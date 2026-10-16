import { initializeApp, getApps, getApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth'
import { getApiUrl } from '../config/api'

export const firebaseConfig = {
  apiKey: "AIzaSyBibds09YOwLFUaEk8p_W-vEP1OI1RNwkk",
  authDomain: "guidemeto-bdf36.firebaseapp.com",
  projectId: "guidemeto-bdf36",
  storageBucket: "guidemeto-bdf36.firebasestorage.app",
  messagingSenderId: "1055819077227",
  appId: "1:1055819077227:web:80c85025a1f6a1e360f786"
}

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export interface TelmyUserProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  plan: 'free' | 'standard' | 'pro'
  credits: number
  language: string
  isExtensionConnected?: boolean
  academyRewardClaimed?: boolean
}

/**
 * Sign In with Google Popup
 */
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider)
  const user = result.user

  // Sync with Telmy Backend
  await syncUserWithBackend(user)
  return user
}

/**
 * Log Out
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth)
  localStorage.removeItem('telmy_user')
  window.postMessage({ type: 'TELMY_USER_SESSION_CLEAR' }, '*')
}

/**
 * Sync user identity to backend & broadcast to Chrome extension
 */
export async function syncUserWithBackend(user: User): Promise<void> {
  const profilePayload = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'Telmy User',
    email: user.email || '',
    photoURL: user.photoURL || '',
    language: localStorage.getItem('telmy_lang') || 'en'
  }

  // 1. Save in local cache
  localStorage.setItem('telmy_user', JSON.stringify(profilePayload))

  // 2. Broadcast window message for Chrome extension content script
  window.postMessage({ type: 'TELMY_USER_SESSION_SYNC', user: profilePayload }, '*')

  // 3. Post to backend Express server if available
  try {
    const res = await fetch(getApiUrl('/api/user/sync'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profilePayload)
    })
    if (!res.ok) {
      console.warn('[Sync] Backend responded with non-200 status')
    }
  } catch (err) {
    console.warn('[Sync] Backend unreachable, session persisted in browser cache.')
  }
}
