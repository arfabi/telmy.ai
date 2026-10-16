import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TRANSLATIONS, TranslationData } from '@/data/translations'
import { JAPAC_LANGUAGES } from '@/data/languages'

interface LanguageContextType {
  lang: string
  currentLang: string
  setLang: (lang: string) => void
  t: TranslationData
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const SUPPORTED_CODES = JAPAC_LANGUAGES.map((l) => l.code.toLowerCase())

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Ambil kode bahasa dari URL subpath (misal /id, /tw, /zh-tw, /ja, /ko, /en)
  const extractLangFromPath = (pathname: string): string | null => {
    const rawCode = pathname.split('/')[1]?.toLowerCase()
    if (!rawCode) return null

    // Alias /tw atau /zh-tw diarahkan ke zh-TW
    if (rawCode === 'tw' || rawCode === 'zh-tw') return 'zh-TW'
    if (rawCode === 'cn') return 'zh'

    const matched = SUPPORTED_CODES.find((c) => c === rawCode)
    return matched || null
  }

  const initialLang = (): string => {
    const fromPath = extractLangFromPath(location.pathname)
    if (fromPath) return fromPath

    const saved = localStorage.getItem('telmy_lang')
    if (saved && (SUPPORTED_CODES.includes(saved.toLowerCase()) || saved === 'zh-TW')) {
      return saved
    }
    return 'en'
  }

  const [lang, setLangState] = useState<string>(initialLang)
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en']

  // Pantau perubahan URL dan update SEO metadata & hreflang
  useEffect(() => {
    const codeFromUrl = extractLangFromPath(location.pathname)
    const activeCode = codeFromUrl || lang
    if (codeFromUrl && codeFromUrl !== lang) {
      setLangState(codeFromUrl)
      localStorage.setItem('telmy_lang', codeFromUrl)
    }

    // Update document HTML lang & SEO Title
    document.documentElement.lang = activeCode
    if (t?.metaTitle) {
      document.title = t.metaTitle
    }

    // Dynamic Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    if (t?.heroSubtitle) {
      metaDesc.setAttribute('content', t.heroSubtitle)
    }

    // Injeksi matrix hreflang ke <head> jika belum ada
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]')
    if (existingHreflangs.length === 0) {
      JAPAC_LANGUAGES.forEach((l) => {
        const link = document.createElement('link')
        link.rel = 'alternate'
        link.hreflang = l.code
        const sub = l.code === 'zh-TW' ? 'tw' : l.code.toLowerCase()
        link.href = `https://telmy.id/${sub}`
        document.head.appendChild(link)
      })

      // x-default hreflang
      const defLink = document.createElement('link')
      defLink.rel = 'alternate'
      defLink.hreflang = 'x-default'
      defLink.href = 'https://telmy.id/'
      document.head.appendChild(defLink)
    }
  }, [location.pathname, lang, t])

  const setLang = (newLang: string) => {
    setLangState(newLang)
    localStorage.setItem('telmy_lang', newLang)
    document.documentElement.lang = newLang

    // Alihkan rute URL ke subpath bahasa yang baru jika sedang di landing page
    const pathname = location.pathname.toLowerCase()
    const isAppPage = pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/connect') || 
                      pathname.startsWith('/signin') || 
                      pathname.startsWith('/help') ||
                      pathname.startsWith('/features') ||
                      pathname.startsWith('/pricing') ||
                      pathname.startsWith('/download') ||
                      pathname.startsWith('/academy') ||
                      pathname.startsWith('/faq')
    if (!isAppPage) {
      const subpath = newLang === 'zh-TW' ? 'tw' : newLang.toLowerCase()
      navigate(`/${subpath}`)
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, currentLang: lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
