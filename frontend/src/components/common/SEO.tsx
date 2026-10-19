import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { JAPAC_LANGUAGES } from '@/data/languages'

export interface SeoProps {
  title?: string
  description?: string
  ogImage?: string
  canonicalUrl?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

// Global localized meta descriptions per page type
const LOCALIZED_PAGE_META: Record<
  string,
  Record<string, { title: string; description: string }>
> = {
  features: {
    en: {
      title: 'Telmy.ai Features — AI Explanations, AutoFill & Accessibility Hub',
      description:
        'Explore Telmy.ai: contextual form explainer, 1-Click AutoFill, client-side AES-256 encrypted vault, pre-submit traffic light audit, and 14 accessibility profiles.',
    },
    id: {
      title: 'Fitur Telmy.ai — Panduan AI, AutoFill Cepat & Pusat Aksesibilitas',
      description:
        'Fitur lengkap Telmy.ai: penjelasan formulir kontekstual, AutoFill 1-Klik, brankas enkripsi AES-256 lokal, audit pra-submit, dan 14 alat aksesibilitas ramah disabilitas.',
    },
    ja: {
      title: 'Telmy.ai 機能一覧 — AI項目解説・自動入力・アクセシビリティハブ',
      description:
        'Telmy.aiの全機能：公的申請フォームの文脈解説、1クリック自動入力、端末内AES-256暗号化保管庫、提出前エラー監査、14種類のアクセシビリティ機能。',
    },
    ko: {
      title: 'Telmy.ai 기능 소개 — AI 서식 설명, 원클릭 자동완성 및 접근성 허브',
      description:
        'Telmy.ai의 핵심 기능: 공공 서식 AI 문맥 해설, 안전한 1클릭 자동완성, 기기 내 AES-256 암호화 보관함, 제출 전 신호등 오류 감사 및 14가지 접근성 도구.',
    },
    zh: {
      title: 'Telmy.ai 功能介绍 — AI 表格解析、一键自动填充与无障碍中心',
      description:
        '探索 Telmy.ai：官方公文表格智能解析、一键自动填充、本地 AES-256 加密保险库、提交前信号灯审核与 14 种无障碍辅助工具。',
    },
    'zh-TW': {
      title: 'Telmy.ai 功能介紹 — AI 表格解析、一鍵自動填寫與無障礙中心',
      description:
        '探索 Telmy.ai：官方公文表格智慧解析、一鍵自動填寫、本機 AES-256 加密保險庫、提交前紅綠燈審核與 14 種無障礙輔助工具。',
    },
  },
  pricing: {
    en: {
      title: 'Telmy.ai Pricing — Start Free. Transparent Plans for Everyone.',
      description:
        'Free 5 forms every month forever with 14 accessibility tools. Upgrade to Pro for unlimited forms, multi-page PDF import, and family/client profiles.',
    },
    id: {
      title: 'Harga Telmy.ai — Gratis 5 Formulir Tiap Bulan. Transparan & Terjangkau.',
      description:
        'Gratis 5 formulir setiap bulan selamanya dengan 14 alat aksesibilitas lengkap. Upgrade ke Pro untuk kuota tanpa batas dan impor dokumen PDF.',
    },
    ja: {
      title: 'Telmy.ai 料金プラン — 毎月5件まで永久無料・安心の透明プラン',
      description:
        '毎月5件の申請フォーム解説・入力が完全無料。複数ページPDF取り込みや家族・顧客プロフィール対応のProプランもご用意。',
    },
  },
  download: {
    en: {
      title: 'Download Telmy.ai Extension — Chrome, Edge, Firefox & Opera',
      description:
        'Install the free Telmy.ai browser extension in 60 seconds. Add your AI form filling companion and Smart Auditor to Chrome, Edge, Firefox, and Opera.',
    },
    id: {
      title: 'Unduh Ekstensi Telmy.ai — Chrome, Edge, Firefox & Opera',
      description:
        'Pasang ekstensi browser Telmy.ai gratis dalam 60 detik. Dapatkan pendamping pengisian formulir resmi dan auditor pintar di browser favorit Anda.',
    },
    ja: {
      title: 'Telmy.ai 拡張機能をダウンロード — Chrome、Edge、Firefox、Opera対応',
      description:
        'わずか1分でTelmy.aiブラウザ拡張機能を無料インストール。Chrome、Edge、Firefox、Operaで公的申請をストレスフリーに。',
    },
  },
  academy: {
    en: {
      title: 'Telmy Academy — Master Visas, Scholarships & Apostille Portals',
      description:
        'Step-by-step masterclasses and practice sandboxes for MEXT, LPDP, Schengen visas, and legalization forms with Telmy.ai companion.',
    },
    id: {
      title: 'Telmy Academy — Panduan Praktik Beasiswa, Visa & Apostille',
      description:
        'Pelajari langkah demi langkah pengisian beasiswa MEXT, LPDP, visa luar negeri, dan apostille dengan simulasi interaktif Telmy.ai.',
    },
  },
  faq: {
    en: {
      title: 'Telmy.ai FAQ — Clear Answers on Security, Privacy, AI & Pricing',
      description:
        'Find answers about how Telmy.ai works, browser compatibility, zero-knowledge AES-256 security, PDF support, and quota limits.',
    },
    id: {
      title: 'FAQ Telmy.ai — Jawaban Lengkap Seputar Keamanan, AI & Layanan',
      description:
        'Pelajari cara kerja Telmy.ai, kompatibilitas browser, privasi zero-knowledge AES-256, dukungan formulir PDF, dan kuota gratis.',
    },
  },
  security: {
    en: {
      title: 'Telmy.ai Security & Cryptography Architecture — Zero Plaintext',
      description:
        'Technical breakdown of Telmy.ai security: Client-Side AES-256-GCM vault, Zero-Retention OCR memory, client-side PII sanitizer, and Firestore ciphertext storage.',
    },
    id: {
      title: 'Arsitektur Keamanan & Kriptografi Telmy.ai — Zero Plaintext',
      description:
        'Penjelasan teknis keamanan Telmy.ai: brankas lokal AES-256-GCM, OCR tanpa penyimpanan dokumen, sanitasi PII di browser, dan penyimpanan ciphertext Firestore.',
    },
  },
  privacy: {
    en: {
      title: 'Privacy Policy — Telmy.ai Browser Extension & Services',
      description:
        'Official Privacy Policy for Telmy.ai Chrome and Firefox extensions. Compliant with Chrome Web Store and Mozilla AMO Single-Purpose policies.',
    },
    id: {
      title: 'Kebijakan Privasi — Ekstensi Browser & Layanan Telmy.ai',
      description:
        'Kebijakan Privasi resmi Telmy.ai untuk ekstensi Chrome, Edge, dan Firefox. Mematuhi standar keamanan Google Chrome Web Store dan regulasi data.',
    },
  },
  terms: {
    en: {
      title: 'Terms of Service — Telmy.ai Form Companion',
      description:
        'Usage agreement and terms for Telmy.ai. Telmy explains and guides; you verify, decide, and submit. Clear terms for free and Pro users.',
    },
    id: {
      title: 'Syarat & Ketentuan Layanan — Telmy.ai',
      description:
        'Perjanjian penggunaan dan ketentuan layanan Telmy.ai. Telmy memandu dan menjelaskan; Anda yang memverifikasi, memutuskan, dan mengirimkan formulir.',
    },
  },
}

export const SEO: React.FC<SeoProps> = ({
  title,
  description,
  ogImage = 'https://telmy.id/logo.png',
  canonicalUrl,
  type = 'website',
  noIndex = false,
}) => {
  const { lang, t } = useLanguage()
  const location = useLocation()

  useEffect(() => {
    // 1. Determine active page key from path
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]?.toLowerCase() || ''
    
    // Check if first segment is a language code (e.g. /id, /en, /ja)
    const isLangSubpath = JAPAC_LANGUAGES.some((l) => l.code.toLowerCase() === firstSegment || (firstSegment === 'tw' && l.code === 'zh-TW'))
    const pageSegment = isLangSubpath ? (pathSegments[1]?.toLowerCase() || 'home') : (firstSegment || 'home')

    // 2. Resolve Title & Description
    let resolvedTitle = title
    let resolvedDesc = description

    if (!resolvedTitle) {
      if (pageSegment === 'home') {
        resolvedTitle = t.metaTitle || 'Telmy.ai: AI Form Assistant for Government & Public Service Portals'
      } else if (LOCALIZED_PAGE_META[pageSegment]) {
        const pageLangs = LOCALIZED_PAGE_META[pageSegment]
        const langData = pageLangs[lang] || pageLangs['en']
        resolvedTitle = langData ? langData.title : `${pageSegment.toUpperCase()} — Telmy.ai`
      } else {
        resolvedTitle = `${pageSegment.charAt(0).toUpperCase() + pageSegment.slice(1)} — Telmy.ai`
      }
    }

    if (!resolvedDesc) {
      if (pageSegment === 'home') {
        resolvedDesc = t.heroSubtitle || 'A free browser extension that explains official forms in your language, fills them from your documents, and checks your answers before you submit.'
      } else if (LOCALIZED_PAGE_META[pageSegment]) {
        const pageLangs = LOCALIZED_PAGE_META[pageSegment]
        const langData = pageLangs[lang] || pageLangs['en']
        resolvedDesc = langData ? langData.description : 'Telmy.ai helps you understand, complete, and audit complex web forms.'
      } else {
        resolvedDesc = 'Telmy.ai helps you understand, complete, and audit complex web forms.'
      }
    }

    // 3. Update DOM Title
    document.title = resolvedTitle

    // Helper for creating/updating meta tag
    const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrVal)
        document.head.appendChild(el)
      }
      el.setAttribute('content', contentVal)
    }

    // Standard Meta
    setMetaTag('name', 'description', resolvedDesc)
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')

    // Resolve Canonical URL
    const fullCanonical = canonicalUrl || `https://telmy.id${location.pathname}`
    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalEl)
    }
    canonicalEl.setAttribute('href', fullCanonical)

    // OpenGraph Meta
    setMetaTag('property', 'og:type', type)
    setMetaTag('property', 'og:site_name', 'Telmy.ai')
    setMetaTag('property', 'og:url', fullCanonical)
    setMetaTag('property', 'og:title', resolvedTitle)
    setMetaTag('property', 'og:description', resolvedDesc)
    setMetaTag('property', 'og:image', ogImage)
    setMetaTag('property', 'og:image:alt', 'Telmy.ai Form Filling Assistant')
    setMetaTag('property', 'og:locale', lang)

    // Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', resolvedTitle)
    setMetaTag('name', 'twitter:description', resolvedDesc)
    setMetaTag('name', 'twitter:image', ogImage)

    // Set HTML lang attribute
    document.documentElement.lang = lang

    // Multi-Language hreflang Matrix Injection
    // Clear and rebuild hreflangs for current page
    document.querySelectorAll('link[rel="alternate"][data-telmy-seo="true"]').forEach((el) => el.remove())

    JAPAC_LANGUAGES.forEach((l) => {
      const link = document.createElement('link')
      link.setAttribute('rel', 'alternate')
      link.setAttribute('data-telmy-seo', 'true')
      link.setAttribute('hreflang', l.code)

      const subpath = l.code === 'zh-TW' ? 'tw' : l.code.toLowerCase()
      // If root/home, link is https://telmy.id/{subpath}
      // If subpage, link is https://telmy.id/{pageSegment}
      if (pageSegment === 'home') {
        link.setAttribute('href', `https://telmy.id/${subpath}`)
      } else {
        link.setAttribute('href', `https://telmy.id/${pageSegment}`)
      }
      document.head.appendChild(link)
    })

    // Default hreflang (x-default)
    const xDefaultLink = document.createElement('link')
    xDefaultLink.setAttribute('rel', 'alternate')
    xDefaultLink.setAttribute('data-telmy-seo', 'true')
    xDefaultLink.setAttribute('hreflang', 'x-default')
    xDefaultLink.setAttribute('href', pageSegment === 'home' ? 'https://telmy.id/' : `https://telmy.id/${pageSegment}`)
    document.head.appendChild(xDefaultLink)

  }, [title, description, ogImage, canonicalUrl, type, noIndex, lang, t, location.pathname])

  return null
}
