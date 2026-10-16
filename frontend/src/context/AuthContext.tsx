import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, TelmyUserProfile, logoutUser } from '@/services/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { getApiUrl } from '@/config/api'

interface AuthContextType {
  currentUser: User | null
  userProfile: TelmyUserProfile | null
  loading: boolean
  logout: () => Promise<void>
  refreshQuota: () => Promise<void>
  updateUserProfile: (patch: Partial<TelmyUserProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<TelmyUserProfile | null>(() => {
    const saved = localStorage.getItem('telmy_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return null
      }
    }
    return null
  })
  const [loading, setLoading] = useState(true)

  const fetchQuota = async (uid: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/user/quota/${uid}`))
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setUserProfile((prev) => {
            if (!prev) return null
            const updated = {
              ...prev,
              credits: json.data.totalRemaining ?? 5,
              plan: json.data.plan || 'free'
            }
            localStorage.setItem('telmy_user', JSON.stringify(updated))
            return updated
          })
        }
      }
    } catch (e) {
      console.warn('[AuthContext] Could not fetch remote quota, utilizing local state.')
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const profile: TelmyUserProfile = {
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'Telmy User',
          email: user.email || '',
          photoURL: user.photoURL || '',
          plan: 'free',
          credits: 5,
          language: localStorage.getItem('telmy_lang') || 'en'
        }
        setUserProfile(profile)
        localStorage.setItem('telmy_user', JSON.stringify(profile))
        await fetchQuota(user.uid)
      } else {
        const cached = localStorage.getItem('telmy_user')
        if (cached) {
          try {
            setUserProfile(JSON.parse(cached))
          } catch (e) {
            setUserProfile(null)
          }
        } else {
          setUserProfile(null)
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await logoutUser()
    setCurrentUser(null)
    setUserProfile(null)
  }

  const refreshQuota = async () => {
    if (userProfile?.uid) {
      await fetchQuota(userProfile.uid)
    }
  }

  const updateUserProfile = (patch: Partial<TelmyUserProfile>) => {
    setUserProfile((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...patch }
      localStorage.setItem('telmy_user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, logout, refreshQuota, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
