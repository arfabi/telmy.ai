import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DASHBOARD_I18N, DashboardI18n } from '@/data/dashboardI18n'
import { 
  Zap, 
  Key, 
  History, 
  LogOut, 
  User, 
  RefreshCw, 
  CheckCircle2, 
  Shield, 
  CreditCard, 
  Lock,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Trash2,
  GraduationCap,
  FileText,
  HelpCircle,
  Trophy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  AlertTriangle,
  Play,
  Volume2,
  Search,
  Check,
  Layers,
  Award
} from 'lucide-react'

// 11 Asia-Pacific Countries (Displayed by country name & native language without raw codes)
export const DASHBOARD_COUNTRIES = [
  { code: 'id', flag: '🇮🇩', country: 'Indonesia', nativeName: 'Bahasa Indonesia' },
  { code: 'en', flag: '🇬🇧', country: 'Global / International', nativeName: 'English' },
  { code: 'ja', flag: '🇯🇵', country: 'Jepang (Japan)', nativeName: '日本語' },
  { code: 'ko', flag: '🇰🇷', country: 'Korea Selatan (South Korea)', nativeName: '한국어' },
  { code: 'zh', flag: '🇨🇳', country: 'Tiongkok / China', nativeName: '简体中文' },
  { code: 'zh-tw', flag: '🇹🇼', country: 'Taiwan', nativeName: '繁體中文' },
  { code: 'vi', flag: '🇻🇳', country: 'Vietnam', nativeName: 'Tiếng Việt' },
  { code: 'th', flag: '🇹🇭', country: 'Thailand', nativeName: 'ภาษาไทย' },
  { code: 'hi', flag: '🇮🇳', country: 'India', nativeName: 'हिन्दी' },
  { code: 'fil', flag: '🇵🇭', country: 'Filipina (Philippines)', nativeName: 'Filipino' },
  { code: 'ms', flag: '🇲🇾', country: 'Malaysia', nativeName: 'Bahasa Melayu' }
]

const BIP39_WORDS = [
  'alpha', 'beacon', 'cable', 'daring', 'echo', 'falcon', 'galaxy', 'harbor',
  'island', 'jungle', 'kinetic', 'lunar', 'matrix', 'nebula', 'orbit', 'pulse',
  'quantum', 'radar', 'safari', 'titan', 'uranium', 'vector', 'walnut', 'zenith',
  'anchor', 'breeze', 'canyon', 'delta', 'ember', 'forest', 'glacier', 'horizon'
]

export const DashboardPage: React.FC = () => {
  const { userProfile, logout, refreshQuota } = useAuth()
  const { currentLang, setLang } = useLanguage()
  const navigate = useNavigate()

  // 6 Main Menu Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'academy' | 'profile' | 'forms' | 'autofill' | 'credits'>('overview')

  // Authentication guard
  useEffect(() => {
    if (!userProfile && !localStorage.getItem('telmy_user')) {
      navigate('/signin')
    }
  }, [userProfile, navigate])

  // Profile-driven active language determination
  // Priority: userProfile.language > currentLang > localStorage > 'en'
  const effectiveLangCode = (userProfile?.language || currentLang || localStorage.getItem('telmy_lang') || 'en').toLowerCase()
  const dI18n: DashboardI18n = DASHBOARD_I18N[effectiveLangCode] || DASHBOARD_I18N['en']

  // Keep global LanguageContext in sync with user profile if profile has a preferred language
  useEffect(() => {
    if (userProfile?.language && userProfile.language.toLowerCase() !== currentLang.toLowerCase()) {
      setLang(userProfile.language.toLowerCase())
    }
  }, [userProfile?.language])

  // Selected Country in Profile Tab
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(effectiveLangCode)
  const [profileName, setProfileName] = useState(userProfile?.displayName || 'Citizen Applicant')
  const [profileSavedToast, setProfileSavedToast] = useState(false)

  useEffect(() => {
    if (userProfile?.displayName) setProfileName(userProfile.displayName)
    if (userProfile?.language) setSelectedCountryCode(userProfile.language.toLowerCase())
  }, [userProfile])

  // ==========================================
  // STATE: ACADEMY PROGRESS & REWARD
  // ==========================================
  const academyMissions = [
    {
      id: 'm1',
      title: 'First Flight: Connect Chrome Extension',
      desc: 'Pasang dan sematkan ikon Telmy di toolbar browser Chrome untuk sinkronisasi otomatis.',
      tag: 'Setup'
    },
    {
      id: 'm2',
      title: 'Listen & Understand: 11 Languages Audio',
      desc: 'Coba fitur WaveNet Text-to-Speech untuk membacakan panduan dalam bahasa pilihan Anda.',
      tag: 'A11y Audio'
    },
    {
      id: 'm3',
      title: '1-Click AutoFill: Smart Vault Ingestion',
      desc: 'Simpan nama resmi dan nomor paspor di brankas terenkripsi, lalu isi formulir dengan 1-klik.',
      tag: 'Zero-Knowledge'
    },
    {
      id: 'm4',
      title: 'Audit Before Submit: Error Blocker',
      desc: 'Pelajari cara Telmy mendeteksi field kosong atau format paspor invalid sebelum terkirim.',
      tag: 'Safe Validation'
    },
    {
      id: 'm5',
      title: 'Focus & Comfort: Situational Presets',
      desc: 'Aktifkan profil aksesibilitas ADHD Spotlight, Font Disleksia, atau Kontras Tinggi WCAG AAA.',
      tag: 'Ergonomics'
    }
  ]

  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('telmy_academy_progress')
      return saved ? JSON.parse(saved) : ['m1']
    } catch (e) {
      return ['m1']
    }
  })

  const [rewardClaimed, setRewardClaimed] = useState<boolean>(() => {
    return Boolean(userProfile?.academyRewardClaimed || localStorage.getItem('telmy_academy_reward_claimed') === 'true')
  })
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimMessage, setClaimMessage] = useState<string | null>(null)

  const toggleMission = (id: string) => {
    let next: string[]
    if (completedMissions.includes(id)) {
      next = completedMissions.filter(m => m !== id)
    } else {
      next = [...completedMissions, id]
    }
    setCompletedMissions(next)
    localStorage.setItem('telmy_academy_progress', JSON.stringify(next))
  }

  const markAllCompleted = () => {
    const allIds = academyMissions.map(m => m.id)
    setCompletedMissions(allIds)
    localStorage.setItem('telmy_academy_progress', JSON.stringify(allIds))
  }

  const handleClaimReward = async () => {
    if (rewardClaimed || claimLoading) return
    setClaimLoading(true)
    setClaimMessage(null)

    try {
      const uid = userProfile?.uid || 'guest_user'
      const res = await fetch('/api/user/claim-academy-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      })
      const data = await res.json()

      if (data.success) {
        setRewardClaimed(true)
        localStorage.setItem('telmy_academy_reward_claimed', 'true')
        setClaimMessage('🎉 ' + data.message)
        if (refreshQuota) refreshQuota()
      } else {
        setClaimMessage(data.error || 'Gagal mengklaim reward.')
      }
    } catch (e: any) {
      setClaimMessage('Koneksi server gagal, namun progres Anda tetap tersimpan.')
    } finally {
      setClaimLoading(false)
    }
  }

  // Save Profile Preferences
  const handleSaveProfile = async () => {
    try {
      const uid = userProfile?.uid || 'guest_user'
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          displayName: profileName,
          language: selectedCountryCode,
          email: userProfile?.email || ''
        })
      })
      setLang(selectedCountryCode)
      setProfileSavedToast(true)
      setTimeout(() => setProfileSavedToast(false), 3000)
    } catch (e) {
      setProfileSavedToast(true)
      setTimeout(() => setProfileSavedToast(false), 3000)
    }
  }

  // ==========================================
  // STATE: FORMS HISTORY & PDF EDITOR DEMO
  // ==========================================
  const [formFilter, setFormFilter] = useState<'all' | 'online' | 'pdf'>('all')
  const [formsHistoryList, setFormsHistoryList] = useState<any[]>([
    {
      id: 'f1',
      title: 'Schengen Visa Application Form (Short Stay)',
      authority: 'European Consular Directorate',
      type: 'online',
      date: '14 Okt 2026',
      status: 'Ready',
      fieldsCount: 37
    },
    {
      id: 'f2',
      title: 'Beasiswa LPDP - Formulir Komitmen Kebangsaan',
      authority: 'Kementerian Keuangan RI',
      type: 'pdf',
      date: '12 Okt 2026',
      status: 'Ready',
      fieldsCount: 24
    },
    {
      id: 'f3',
      title: 'Pendaftaran Seleksi CASN / SSCASN BKN 2026',
      authority: 'Badan Kepegawaian Negara',
      type: 'online',
      date: '08 Okt 2026',
      status: 'Ready',
      fieldsCount: 42
    }
  ])

  // PDF Guidance Editor Mockup Modal
  const [editorModalOpen, setEditorModalOpen] = useState(false)
  const [activeEditorField, setActiveEditorField] = useState(1)

  // ==========================================
  // STATE: AUTOFILL MULTI-VAULTS & DUAL-LOCK
  // ==========================================
  const [vaultUnlocked, setVaultUnlocked] = useState(false)
  const [unlockModalOpen, setUnlockModalOpen] = useState(false)
  const [unlockMode, setUnlockMode] = useState<'password' | 'seed'>('password')
  const [inputPassword, setInputPassword] = useState('')
  const [inputSeedText, setInputSeedText] = useState('')
  const [unlockError, setUnlockError] = useState<string | null>(null)

  // 12-Seed Word Management
  const [masterSeedPhrase, setMasterSeedPhrase] = useState(() => {
    const saved = localStorage.getItem('telmy_master_seed')
    if (saved) return saved
    const words = []
    for (let i = 0; i < 12; i++) {
      words.push(BIP39_WORDS[Math.floor(Math.random() * BIP39_WORDS.length)])
    }
    const generated = words.join(' ')
    localStorage.setItem('telmy_master_seed', generated)
    return generated
  })
  const [seedRegenWarningOpen, setSeedRegenWarningOpen] = useState(false)

  // Dynamic Vault Compartments
  const [vaultCompartments, setVaultCompartments] = useState<any[]>([
    {
      id: 'c1',
      title: 'Identitas Utama (Identity Dossier)',
      badge: 'Utama',
      fields: [
        { key: 'Full Name', value: userProfile?.displayName || 'SITI NURHALIZA' },
        { key: 'NIK / Resident ID', value: '3171012304950001' },
        { key: 'Date of Birth', value: '1995-04-23' },
        { key: 'Citizenship', value: 'Indonesian' }
      ]
    },
    {
      id: 'c2',
      title: 'Paspor & Perjalanan Internasional',
      badge: 'Travel',
      fields: [
        { key: 'Passport Number', value: 'A12345678' },
        { key: 'Expiry Date', value: '2030-05-18' },
        { key: 'Issuing Office', value: 'Kantor Imigrasi Jakarta Selatan' }
      ]
    },
    {
      id: 'c3',
      title: 'Akademik & Beasiswa',
      badge: 'Edukasi',
      fields: [
        { key: 'Degree', value: 'Bachelor of Computer Science' },
        { key: 'University', value: 'Universitas Indonesia' },
        { key: 'GPA / IPK', value: '3.84 / 4.00' }
      ]
    }
  ])

  const [newCompartmentTitle, setNewCompartmentTitle] = useState('')

  const handleUnlockVault = () => {
    setUnlockError(null)
    if (unlockMode === 'password') {
      if (inputPassword.trim().length < 6) {
        setUnlockError('Password harus minimal 6 karakter.')
        return
      }
    } else {
      const words = inputSeedText.trim().split(/\s+/)
      if (words.length !== 12) {
        setUnlockError('Wajib memasukkan 12 kata rahasia yang dipisahkan spasi.')
        return
      }
    }
    setVaultUnlocked(true)
    setUnlockModalOpen(false)
    setInputPassword('')
    setInputSeedText('')
  }

  const handleRegenerateSeedWords = () => {
    const words = []
    for (let i = 0; i < 12; i++) {
      words.push(BIP39_WORDS[Math.floor(Math.random() * BIP39_WORDS.length)])
    }
    const newSeed = words.join(' ')
    setMasterSeedPhrase(newSeed)
    localStorage.setItem('telmy_master_seed', newSeed)
    setVaultCompartments([
      {
        id: 'c_new',
        title: 'Brankas Baru (Kunci Baru)',
        badge: 'New',
        fields: [{ key: 'Full Name', value: userProfile?.displayName || 'Citizen Applicant' }]
      }
    ])
    setSeedRegenWarningOpen(false)
  }

  const handleAddCompartment = () => {
    if (!newCompartmentTitle.trim()) return
    const newC = {
      id: 'c_' + Date.now(),
      title: newCompartmentTitle,
      badge: 'Custom',
      fields: [{ key: 'Field Baru', value: 'Isian Baru' }]
    }
    setVaultCompartments([...vaultCompartments, newC])
    setNewCompartmentTitle('')
  }

  const handleDeleteCompartment = (id: string) => {
    setVaultCompartments(vaultCompartments.filter(c => c.id !== id))
  }

  // ==========================================
  // STATE: CREDITS & BILLING INVOICES
  // ==========================================
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [invoicesList, setInvoicesList] = useState<any[]>([])
  const [invoicesLoading, setInvoicesLoading] = useState(false)

  const fetchInvoices = async () => {
    setInvoicesLoading(true)
    try {
      const uid = userProfile?.uid || 'guest_user'
      const res = await fetch(`/api/payment/invoices/${uid}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setInvoicesList(data.data)
      } else {
        setInvoicesList([
          {
            id: 'MAYAR-SIM-9421',
            invoiceId: 'MAYAR-SIM-9421',
            item: 'Telmy.ai Standard (25 Forms)',
            amount: 'Rp 49.000 (~$3)',
            date: '10 Okt 2026, 14:30',
            method: 'QRIS / Virtual Account',
            status: 'PAID'
          }
        ])
      }
    } catch (e) {
      setInvoicesList([])
    } finally {
      setInvoicesLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'credits') {
      fetchInvoices()
    }
  }, [activeTab])

  // Sync Extension Broadcast
  const [syncNotice, setSyncNotice] = useState(false)
  const handleBroadcastExtension = () => {
    if (userProfile) {
      window.postMessage({ type: 'TELMY_USER_SESSION_SYNC', user: userProfile }, '*')
      setSyncNotice(true)
      setTimeout(() => setSyncNotice(false), 3000)
    }
  }

  // Current active country item
  const activeCountryItem = DASHBOARD_COUNTRIES.find(c => c.code === effectiveLangCode) || DASHBOARD_COUNTRIES[0]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900 text-lg">
              <img src="/telmy_icon.png" alt="Telmy" className="w-8 h-8 rounded-lg shadow-xs" />
              <span>Telmy<span className="text-blue-600">.ai</span></span>
            </Link>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-md">
              {dI18n.cockpitBadge}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-xs text-slate-600">
                {dI18n.navHome}
              </Button>
            </Link>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shadow-xs">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profileName.slice(0, 2).toUpperCase() || 'TU'
                )}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-slate-900 leading-tight">
                  {userProfile?.displayName || 'Telmy User'}
                </p>
                <p className="text-slate-400 text-[11px] truncate max-w-[140px]">
                  {userProfile?.email || 'user@telmy.id'}
                </p>
              </div>
              <Button
                onClick={() => {
                  logout()
                  navigate('/signin')
                }}
                variant="ghost"
                size="sm"
                className="text-xs text-slate-400 hover:text-red-600 p-1.5"
                title={dI18n.navSignOut}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Banner Quick Cockpit Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {dI18n.cockpitBadge}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {dI18n.welcomeGreeting}, {userProfile?.displayName || 'Member Telmy'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              {dI18n.bannerSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={handleBroadcastExtension}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-5 shadow-md shadow-blue-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              <span>{syncNotice ? dI18n.btnSyncDone : dI18n.btnSyncExt}</span>
            </Button>
            <Button
              onClick={() => setPricingModalOpen(true)}
              variant="outline"
              className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10 font-bold text-xs h-10 px-5"
            >
              <CreditCard className="w-3.5 h-3.5 mr-2" />
              <span>{dI18n.btnUpgradeQuota}</span>
            </Button>
          </div>
        </div>

        {/* 6 MAIN NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>📊</span>
            <span>{dI18n.tabOverview}</span>
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer relative ${
              activeTab === 'academy'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>🎓</span>
            <span>{dI18n.tabAcademy}</span>
            {!rewardClaimed && completedMissions.length === academyMissions.length && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-2" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>👤</span>
            <span>{dI18n.tabProfile}</span>
          </button>

          <button
            onClick={() => setActiveTab('forms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'forms'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>📋</span>
            <span>{dI18n.tabForms}</span>
          </button>

          <button
            onClick={() => setActiveTab('autofill')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'autofill'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>🔐</span>
            <span>{dI18n.tabAutofill}</span>
          </button>

          <button
            onClick={() => setActiveTab('credits')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'credits'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>💳</span>
            <span>{dI18n.tabCredits}</span>
          </button>
        </div>

        {/* =========================================================
             TAB 1: DASHBOARD OVERVIEW
             ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {dI18n.kpiCreditsLabel}
                </span>
                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                  <span>{userProfile?.credits ?? 5}</span>
                  <span className="text-xs font-semibold text-slate-400">{dI18n.kpiCreditsUnit}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {dI18n.kpiCreditsDesc}
                </p>
              </Card>

              <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {dI18n.kpiFormsLabel}
                </span>
                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                  <span>{formsHistoryList.length}</span>
                  <span className="text-xs font-semibold text-emerald-600">{dI18n.kpiFormsDone}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {dI18n.kpiFormsDesc}
                </p>
              </Card>

              <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {dI18n.kpiLangLabel}
                </span>
                <div className="text-lg font-black text-blue-600 flex items-center gap-2 pt-1">
                  <span className="text-2xl">{activeCountryItem.flag}</span>
                  <span className="truncate">{activeCountryItem.country}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {dI18n.kpiLangDesc}
                </p>
              </Card>
            </div>

            {/* Quick Actions Grid */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                {dI18n.quickActionTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('academy')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-left cursor-pointer group"
                >
                  <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs group-hover:scale-110 transition-transform">🎓</span>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">{dI18n.quickActionAcademy}</strong>
                    <span className="text-[11px] text-slate-500">{dI18n.quickActionAcademySub}</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('autofill')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-left cursor-pointer group"
                >
                  <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs group-hover:scale-110 transition-transform">⚡</span>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">{dI18n.quickActionVault}</strong>
                    <span className="text-[11px] text-slate-500">{dI18n.quickActionVaultSub}</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('forms')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-left cursor-pointer group"
                >
                  <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs group-hover:scale-110 transition-transform">📄</span>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">{dI18n.quickActionEditor}</strong>
                    <span className="text-[11px] text-slate-500">{dI18n.quickActionEditorSub}</span>
                  </div>
                </button>

                <button
                  onClick={() => setPricingModalOpen(true)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-left cursor-pointer group"
                >
                  <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs group-hover:scale-110 transition-transform">💳</span>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">{dI18n.quickActionBilling}</strong>
                    <span className="text-[11px] text-slate-500">{dI18n.quickActionBillingSub}</span>
                  </div>
                </button>
              </div>
            </Card>

            {/* Daily E-Government Trivia Card */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-100 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>{dI18n.triviaTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                💡 {dI18n.triviaBody}
              </p>
            </Card>
          </div>
        )}

        {/* =========================================================
             TAB 2: ACADEMY (MISSION TRACKER & GAMIFICATION REWARD)
             ========================================================= */}
        {activeTab === 'academy' && (
          <div className="space-y-6">
            {/* Reward Banner */}
            <Card className="p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-200" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-100">
                      {dI18n.academyRewardTag}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {dI18n.academyRewardTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
                    {dI18n.academyRewardDesc}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleClaimReward}
                    disabled={rewardClaimed || completedMissions.length < academyMissions.length || claimLoading}
                    className={`w-full sm:w-auto h-11 px-6 font-bold text-xs rounded-xl shadow-md ${
                      rewardClaimed
                        ? 'bg-emerald-600 text-white cursor-default'
                        : completedMissions.length === academyMissions.length
                        ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                        : 'bg-white/30 text-white/70 cursor-not-allowed'
                    }`}
                  >
                    {rewardClaimed ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>{dI18n.academyClaimedBtn}</span>
                      </span>
                    ) : claimLoading ? (
                      <span>{dI18n.academyProcessing}</span>
                    ) : (
                      <span>{dI18n.academyClaimBtn}</span>
                    )}
                  </Button>
                  <span className="text-[11px] text-amber-100/80">
                    {dI18n.academyProgressLabel}: {completedMissions.length} / {academyMissions.length}
                  </span>
                </div>
              </div>

              {claimMessage && (
                <div className="p-3 bg-white/20 rounded-xl text-xs font-semibold backdrop-blur-xs">
                  {claimMessage}
                </div>
              )}
            </Card>

            {/* Missions Checklist List */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {dI18n.academyListTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {dI18n.academyListDesc}
                  </p>
                </div>

                <Button
                  onClick={markAllCompleted}
                  variant="outline"
                  size="sm"
                  className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50 font-bold"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  <span>{dI18n.academyMarkAll}</span>
                </Button>
              </div>

              <div className="space-y-3">
                {academyMissions.map((mission, idx) => {
                  const isDone = completedMissions.includes(mission.id)
                  return (
                    <div
                      key={mission.id}
                      onClick={() => toggleMission(mission.id)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-blue-50/50 border-blue-200'
                          : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all mt-0.5 cursor-pointer ${
                          isDone
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {idx + 1}. {mission.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600">
                            {mission.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {mission.desc}
                        </p>
                      </div>

                      <Link
                        to="/academy"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-center"
                      >
                        <span>{dI18n.academyPracticeLink}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================
             TAB 3: PROFILE (IDENTITY & 11 COUNTRIES SELECTOR)
             ========================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center overflow-hidden shadow-md">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profileName.slice(0, 2).toUpperCase() || 'TU'
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{profileName}</h3>
                  <p className="text-xs text-slate-500">{userProfile?.email || 'user@telmy.id'}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    {dI18n.profileGoogleVerified}
                  </span>
                </div>
              </div>

              {/* Form Input Data Akun */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{dI18n.profileFullName}</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{dI18n.profileEmail}</label>
                  <input
                    type="email"
                    value={userProfile?.email || 'user@telmy.id'}
                    disabled
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-100/70 text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Pemilih Negara Asal / Bahasa Panduan Utama (Pilihan Berdasarkan Negara) */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">
                    {dI18n.profileCountrySelector}
                  </label>
                  <p className="text-[11px] text-slate-500">
                    {dI18n.profileCountryDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DASHBOARD_COUNTRIES.map((item) => {
                    const isSelected = selectedCountryCode === item.code
                    return (
                      <button
                        type="button"
                        key={item.code}
                        onClick={() => setSelectedCountryCode(item.code)}
                        className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 shadow-2xs ring-1 ring-blue-600'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-3xl shrink-0">{item.flag}</span>
                        <div className="min-w-0 flex-1">
                          <strong className="block text-xs font-bold text-slate-900 truncate">
                            {item.country}
                          </strong>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {item.nativeName}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-6 rounded-xl"
                >
                  <span>{dI18n.profileSaveBtn}</span>
                </Button>

                {profileSavedToast && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{dI18n.profileSavedSuccess}</span>
                  </span>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================
             TAB 4: FORMS (RIWAYAT ONLINE/PDF & TELMY EDITOR DEMO)
             ========================================================= */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFormFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dI18n.formsFilterAll}
                </button>
                <button
                  onClick={() => setFormFilter('online')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formFilter === 'online'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dI18n.formsFilterOnline}
                </button>
                <button
                  onClick={() => setFormFilter('pdf')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formFilter === 'pdf'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dI18n.formsFilterPdf}
                </button>
              </div>

              {/* Telmy Editor PDF Guidance Demo Button */}
              <Button
                onClick={() => setEditorModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs"
              >
                <span>{dI18n.formsBtnEditorDemo}</span>
              </Button>
            </div>

            {/* Forms Table */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{dI18n.formsThTitle}</th>
                      <th className="py-3 px-4">{dI18n.formsThAuthority}</th>
                      <th className="py-3 px-4">{dI18n.formsThType}</th>
                      <th className="py-3 px-4">{dI18n.formsThDate}</th>
                      <th className="py-3 px-4">{dI18n.formsThStatus}</th>
                      <th className="py-3 px-4 text-right">{dI18n.formsThAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formsHistoryList
                      .filter(f => formFilter === 'all' || f.type === formFilter)
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {item.title}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{item.authority}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              item.type === 'pdf'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{item.date}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                              🟢 0 Error
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setEditorModalOpen(true)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              {dI18n.formsOpenEditor}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* TELMY EDITOR DEMO MODAL (SPLIT SCREEN VIEW) */}
            {editorModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
                  {/* Editor Header */}
                  <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📄</span>
                      <strong className="text-sm font-bold">{dI18n.editorTitle}</strong>
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">{dI18n.editorDemoMode}</span>
                    </div>
                    <button
                      onClick={() => setEditorModalOpen(false)}
                      className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Split Screen Workspace */}
                  <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Left: Document Mockup with Bounding Box */}
                    <div className="flex-1 bg-slate-100 p-6 overflow-y-auto flex items-center justify-center">
                      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg border border-slate-300 space-y-6 text-slate-800 text-xs font-serif">
                        <div className="text-center border-b pb-4">
                          <h4 className="font-bold text-sm tracking-wide">{dI18n.editorDocTitle}</h4>
                          <p className="text-[10px] text-slate-500 font-sans">{dI18n.editorDocSub}</p>
                        </div>

                        <div className="space-y-4 font-sans text-xs">
                          <div
                            onClick={() => setActiveEditorField(1)}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              activeEditorField === 1
                                ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/20'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <span className="font-bold text-slate-700 block text-[11px]">1. Surname / Family Name</span>
                            <span className="font-mono text-slate-900 font-bold">{userProfile?.displayName?.split(' ').pop() || 'NURHALIZA'}</span>
                          </div>

                          <div
                            onClick={() => setActiveEditorField(2)}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              activeEditorField === 2
                                ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/20'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <span className="font-bold text-slate-700 block text-[11px]">2. First Name(s) / Given Name</span>
                            <span className="font-mono text-slate-900 font-bold">{userProfile?.displayName?.split(' ')[0] || 'SITI'}</span>
                          </div>

                          <div
                            onClick={() => setActiveEditorField(3)}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              activeEditorField === 3
                                ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/20'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <span className="font-bold text-slate-700 block text-[11px]">3. Travel Document Number (Passport)</span>
                            <span className="font-mono text-slate-900 font-bold">A12345678</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: AI Guidance Panel */}
                    <div className="w-full md:w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">🤖</span>
                          <strong className="text-xs font-bold text-slate-900">{dI18n.editorPanelTitle}</strong>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          Field #{activeEditorField}
                        </span>
                      </div>

                      {activeEditorField === 1 && (
                        <div className="space-y-3 text-xs">
                          <h5 className="font-bold text-slate-900">Kolom 1: Surname / Nama Keluarga</h5>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            Masukkan nama belakang Anda sesuai paspor. Jika nama Anda satu kata (mononim), masukkan nama Anda di kolom ini dan kosongkan first name, atau gunakan rekomendasi imigrasi resmi.
                          </p>
                          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 text-[11px]">
                            <strong>Contoh Aman:</strong> SITI NURHALIZA ➔ Surname: NURHALIZA
                          </div>
                        </div>
                      )}

                      {activeEditorField === 2 && (
                        <div className="space-y-3 text-xs">
                          <h5 className="font-bold text-slate-900">Kolom 2: First Name / Nama Depan</h5>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            Nama pemberian Anda sesuai yang tertera pada baris MRZ (Machine Readable Zone) paspor.
                          </p>
                          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 text-[11px]">
                            <strong>Contoh Aman:</strong> SITI
                          </div>
                        </div>
                      )}

                      {activeEditorField === 3 && (
                        <div className="space-y-3 text-xs">
                          <h5 className="font-bold text-slate-900">Kolom 3: Nomor Paspor</h5>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            Nomor paspor resmi diawali huruf kapital diikuti 7 atau 8 angka tanpa spasi.
                          </p>
                          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px]">
                            <strong>Status Audit:</strong> Valid (Format Sesuai ICAO 9303)
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-100 space-y-2">
                        <Button
                          onClick={() => {
                            if (window.speechSynthesis) {
                              const utt = new SpeechSynthesisUtterance(
                                activeEditorField === 1
                                  ? 'Field one is your legal surname or family name as printed on passport.'
                                  : 'Field three is your official travel document or passport number.'
                              )
                              utt.lang = effectiveLangCode === 'zh-tw' ? 'zh-TW' : effectiveLangCode
                              window.speechSynthesis.speak(utt)
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs font-bold text-slate-700"
                        >
                          <Volume2 className="w-3.5 h-3.5 mr-1.5" />
                          <span>{dI18n.editorTtsBtn}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
             TAB 5: AUTOFILL (DYNAMIC VAULTS & DUAL-LOCK)
             ========================================================= */}
        {activeTab === 'autofill' && (
          <div className="space-y-6">
            {/* Vault Lock Status Card */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{vaultUnlocked ? '🔓' : '🔒'}</span>
                    <h3 className="text-base font-bold text-slate-900">
                      {dI18n.vaultTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                    {dI18n.vaultDesc}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {vaultUnlocked ? (
                    <Button
                      onClick={() => setVaultUnlocked(false)}
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold text-slate-600 hover:text-red-600 border-slate-200"
                    >
                      <Lock className="w-3.5 h-3.5 mr-1.5" />
                      <span>{dI18n.vaultLockBtn}</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setUnlockModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs"
                    >
                      <Key className="w-3.5 h-3.5 mr-1.5" />
                      <span>{dI18n.vaultUnlockBtn}</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* 12-Seed Word Action Strip */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">{dI18n.vaultSeedStrip}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(masterSeedPhrase)
                      alert('12 Secret Words copied to clipboard!')
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold text-slate-600 h-8"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    <span>{dI18n.vaultCopySeed}</span>
                  </Button>
                  <Button
                    onClick={() => {
                      const blob = new Blob([masterSeedPhrase], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `telmy-vault-seed-${Date.now().toString(36)}.txt`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold text-slate-600 h-8"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    <span>{dI18n.vaultSaveTxt}</span>
                  </Button>
                  <Button
                    onClick={() => setSeedRegenWarningOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold text-red-600 hover:bg-red-50 h-8"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    <span>{dI18n.vaultRegenBtn}</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* List of Dynamic Vault Compartments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  {dI18n.vaultListTitle} ({vaultCompartments.length})
                </h4>
                {vaultUnlocked && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nama Koper Baru..."
                      value={newCompartmentTitle}
                      onChange={(e) => setNewCompartmentTitle(e.target.value)}
                      className="h-8 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                    <Button
                      onClick={handleAddCompartment}
                      size="sm"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-8 px-3"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      <span>{dI18n.vaultAddBtn}</span>
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vaultCompartments.map((comp) => (
                  <Card key={comp.id} className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                        {comp.badge}
                      </span>
                      {vaultUnlocked && (
                        <button
                          onClick={() => handleDeleteCompartment(comp.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                          title="Hapus koper ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h5 className="font-bold text-slate-900 text-sm leading-tight">
                      {comp.title}
                    </h5>

                    {vaultUnlocked ? (
                      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                        {comp.fields.map((f: any, idx: number) => (
                          <div key={idx} className="flex justify-between font-mono text-[11px]">
                            <span className="text-slate-500 font-sans">{f.key}:</span>
                            <span className="font-bold text-slate-800">{f.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Lock className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                        <span>{dI18n.vaultLockedData}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* UNLOCK MODAL (DUAL-LOCK: PASSWORD OR 12 SEED WORDS) */}
            {unlockModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔐</span>
                      <strong className="text-sm font-bold text-slate-900">{dI18n.vaultUnlockBtn}</strong>
                    </div>
                    <button
                      onClick={() => setUnlockModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Dual Mode Switcher */}
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setUnlockMode('password')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unlockMode === 'password' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      🔑 Master Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnlockMode('seed')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unlockMode === 'seed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      🛡️ 12 Seed Words
                    </button>
                  </div>

                  {unlockMode === 'password' ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Masukkan Password Brankas (6-12 Karakter)</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Tempel 12 Kata Rahasia (Dipisahkan Spasi)</label>
                      <textarea
                        rows={3}
                        placeholder="alpha beacon cable daring..."
                        value={inputSeedText}
                        onChange={(e) => setInputSeedText(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  )}

                  {unlockError && (
                    <p className="text-xs font-bold text-red-600">{unlockError}</p>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      onClick={() => setUnlockModalOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleUnlockVault}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 h-9"
                    >
                      Buka Sekarang
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* SEED REGENERATION WARNING MODAL */}
            {seedRegenWarningOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Peringatan Keras Kriptografi</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Setiap pengguna hanya memiliki <strong>1 set 12-Seed-Words</strong>. Jika Anda men-generate seed baru, maka seluruh koper/brankas existing akan <strong>dihapus total</strong> karena kunci enkripsi berganti secara permanen.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      onClick={() => setSeedRegenWarningOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold"
                    >
                      Batalkan
                    </Button>
                    <Button
                      onClick={handleRegenerateSeedWords}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 h-9"
                    >
                      Saya Paham, Reset & Generate Baru
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
             TAB 6: CREDITS & BILLING INVOICES
             ========================================================= */}
        {activeTab === 'credits' && (
          <div className="space-y-6">
            {/* Credit Balance Card */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {dI18n.creditsTitle}
                  </span>
                  <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                    <span>{userProfile?.credits ?? 5}</span>
                    <span className="text-sm font-semibold text-slate-500">{dI18n.creditsUnit}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {dI18n.creditsPlanPrefix} <span className="font-bold text-slate-800 uppercase">{userProfile?.plan || 'Free Tier'}</span> • Auto-refreshed
                  </p>
                </div>

                <Button
                  onClick={() => setPricingModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5 mr-2" />
                  <span>{dI18n.creditsUpgradeBtn}</span>
                </Button>
              </div>
            </Card>

            {/* Invoices List from Backend */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {dI18n.invoicesTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {dI18n.invoicesDesc}
                  </p>
                </div>
                <Button
                  onClick={fetchInvoices}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  <span>{dI18n.invoicesRefreshBtn}</span>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{dI18n.invoicesThNo}</th>
                      <th className="py-3 px-4">{dI18n.invoicesThItem}</th>
                      <th className="py-3 px-4">{dI18n.invoicesThDate}</th>
                      <th className="py-3 px-4">{dI18n.invoicesThAmount}</th>
                      <th className="py-3 px-4">{dI18n.invoicesThMethod}</th>
                      <th className="py-3 px-4">{dI18n.invoicesThStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoicesList.map((inv) => (
                      <tr key={inv.id || inv.invoiceId} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {inv.invoiceId || inv.id}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{inv.item}</td>
                        <td className="py-3.5 px-4 text-slate-400">{inv.date}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{inv.amount}</td>
                        <td className="py-3.5 px-4 text-slate-600">{inv.method || 'QRIS / VA'}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                            {inv.status || 'PAID'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* PRICING MODAL DIALOG (FREE, STANDARD, PRO) */}
            {pricingModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Pilih Paket Kuota Telmy</h3>
                      <p className="text-xs text-slate-500">Tersinkronisasi langsung ke Cloud Quota & Mayar Gateway</p>
                    </div>
                    <button
                      onClick={() => setPricingModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Free Tier */}
                    <div className="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Starter</span>
                        <h4 className="font-bold text-slate-900 text-sm">Free Tier</h4>
                        <div className="text-xl font-black text-slate-900">Gratis</div>
                        <p className="text-[11px] text-slate-500">5 formulir per bulan (auto-refresh)</p>
                      </div>
                      <Button
                        disabled
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-bold mt-3"
                      >
                        Paket Aktif
                      </Button>
                    </div>

                    {/* Standard Tier */}
                    <div className="p-5 rounded-2xl border-2 border-blue-600 bg-blue-50/30 space-y-3 flex flex-col justify-between shadow-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-600 uppercase">Populer</span>
                        <h4 className="font-bold text-slate-900 text-sm">Standard</h4>
                        <div className="text-xl font-black text-slate-900">Rp 49.000 <span className="text-xs text-slate-500 font-normal">/ bln</span></div>
                        <p className="text-[11px] text-slate-500">25 formulir (~$3 / bulan)</p>
                      </div>
                      <Button
                        onClick={async () => {
                          const uid = userProfile?.uid || 'guest_user'
                          await fetch('/api/payment/simulate-purchase', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ uid, planId: 'standard' })
                          })
                          if (refreshQuota) refreshQuota()
                          fetchInvoices()
                          setPricingModalOpen(false)
                          alert('🎉 Pembayaran Standard berhasil diaktivasi!')
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold mt-3"
                      >
                        Pilih Standard
                      </Button>
                    </div>

                    {/* Pro Tier */}
                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">Best Value</span>
                        <h4 className="font-bold text-slate-900 text-sm">Pro</h4>
                        <div className="text-xl font-black text-slate-900">Rp 99.000 <span className="text-xs text-slate-500 font-normal">/ bln</span></div>
                        <p className="text-[11px] text-slate-500">75 formulir (~$7 / bulan)</p>
                      </div>
                      <Button
                        onClick={async () => {
                          const uid = userProfile?.uid || 'guest_user'
                          await fetch('/api/payment/simulate-purchase', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ uid, planId: 'pro' })
                          })
                          if (refreshQuota) refreshQuota()
                          fetchInvoices()
                          setPricingModalOpen(false)
                          alert('🎉 Pembayaran Pro berhasil diaktivasi!')
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold mt-3"
                      >
                        Pilih Pro
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
