import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import {
  Globe,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ListOrdered,
  Bot,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Focus,
  Volume2,
  VolumeX,
  Type,
  FileCheck2,
  Scan,
  RefreshCw,
  Eye,
  Check,
  ExternalLink
} from 'lucide-react'
import { REAL_ACTION_SHOWCASE_I18N } from '@/data/realActionShowcaseData'

export type FormToolId =
  | 'guide'
  | 'explain'
  | 'autofill'
  | 'audit'
  | 'spotlight'
  | 'tts'
  | 'dyslexia'
  | 'checklist'

export const RealActionShowcase: React.FC = () => {
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState<'gov' | 'web'>('gov')
  const [isScanning, setIsScanning] = useState(false)
  const [activeTool, setActiveTool] = useState<FormToolId>('guide')
  const [isSpotlightOn, setIsSpotlightOn] = useState(false)
  const [isDyslexiaOn, setIsDyslexiaOn] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAutofilled, setIsAutofilled] = useState(false)
  const [auditStatus, setAuditStatus] = useState<'idle' | 'auditing' | 'passed'>('idle')

  const cur = REAL_ACTION_SHOWCASE_I18N[lang] || REAL_ACTION_SHOWCASE_I18N.en

  // Trigger Lightbeam scan animation
  const triggerScanBeam = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
    }, 4200)
  }

  // Handle Tool activation
  const handleSelectTool = (toolId: FormToolId) => {
    setActiveTool(toolId)

    if (toolId === 'guide') {
      triggerScanBeam()
    } else if (toolId === 'autofill') {
      setIsAutofilled(true)
    } else if (toolId === 'audit') {
      setAuditStatus('auditing')
      setTimeout(() => {
        setAuditStatus('passed')
      }, 1000)
    } else if (toolId === 'spotlight') {
      setIsSpotlightOn((prev) => !prev)
    } else if (toolId === 'dyslexia') {
      setIsDyslexiaOn((prev) => !prev)
    } else if (toolId === 'tts') {
      toggleTTS()
    }
  }

  const toggleTTS = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        window.speechSynthesis.cancel()
        const text =
          lang === 'id'
            ? 'Kolom nomor dua adalah Nomor Identitas Kependudukan. Masukkan enam belas digit angka resmi sesuai KTP Anda.'
            : 'Field number two is your National Identification Number. Enter your sixteen-digit official legal ID.'
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang === 'id' ? 'id-ID' : 'en-US'
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        setIsSpeaking(true)
        window.speechSynthesis.speak(utterance)
      }
    } else {
      setIsSpeaking((prev) => !prev)
    }
  }

  // Reset demo states
  const handleResetDemo = () => {
    setIsAutofilled(false)
    setAuditStatus('idle')
    setIsSpotlightOn(false)
    setIsDyslexiaOn(false)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setActiveTool('guide')
  }

  const showcaseData = {
    gov: {
      tag: cur.govTag,
      title: cur.govTitle,
      desc: cur.govDesc,
      urlBar: 'https://elayanan.ahu.go.id/apostille/pendaftaran',
      imageSrc: '/assets/screenshot-ahu-apostille.png',
      alt: 'Telmy Side Panel on AHU Apostille government form',
      highlights: cur.govHighlights,
    },
    web: {
      tag: cur.webTag,
      title: cur.webTitle,
      desc: cur.webDesc,
      urlBar: 'https://form.jotform.com/201591624080045',
      imageSrc: '/assets/screenshot-web-form.png',
      alt: 'Telmy Side Panel on online registration form',
      highlights: cur.webHighlights,
    },
  }

  const current = showcaseData[activeTab]

  // The 8 Core Form Tools Config
  const FORM_TOOLS = [
    {
      id: 'guide' as FormToolId,
      name: lang === 'id' ? '1. Forms Guide' : '1. Forms Guide',
      subtitle: lang === 'id' ? 'Pemetaan Nomor Kolom' : 'Numbered Badge Mapping',
      icon: ListOrdered,
      color: 'text-blue-400 bg-blue-500/15 border-blue-500/40',
      activeColor: 'bg-blue-600 text-white ring-2 ring-blue-400',
    },
    {
      id: 'explain' as FormToolId,
      name: lang === 'id' ? '2. AI Explainer' : '2. AI Explainer',
      subtitle: lang === 'id' ? 'Bahasa Manusia Ramah' : 'Plain-Words Guidance',
      icon: Bot,
      color: 'text-sky-400 bg-sky-500/15 border-sky-500/40',
      activeColor: 'bg-sky-600 text-white ring-2 ring-sky-400',
    },
    {
      id: 'autofill' as FormToolId,
      name: lang === 'id' ? '3. 1-Klik AutoFill' : '3. 1-Click AutoFill',
      subtitle: lang === 'id' ? 'Isi Otomatis dari Vault' : 'Encrypted Vault Fill',
      icon: Zap,
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/40',
      activeColor: 'bg-amber-600 text-white ring-2 ring-amber-400',
    },
    {
      id: 'audit' as FormToolId,
      name: lang === 'id' ? '4. Traffic Light Audit' : '4. Pre-Submit Audit',
      subtitle: lang === 'id' ? 'Cek Masa Paspor & NIK' : 'Check Validity & Formats',
      icon: ShieldAlert,
      color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
      activeColor: 'bg-emerald-600 text-white ring-2 ring-emerald-400',
    },
    {
      id: 'spotlight' as FormToolId,
      name: lang === 'id' ? '5. Form Spotlight' : '5. Form Spotlight',
      subtitle: lang === 'id' ? 'Fokus Kolom / ADHD' : 'ADHD Focus & Dim Outside',
      icon: Focus,
      color: 'text-violet-400 bg-violet-500/15 border-violet-500/40',
      activeColor: 'bg-violet-600 text-white ring-2 ring-violet-400',
    },
    {
      id: 'tts' as FormToolId,
      name: lang === 'id' ? '6. Suara / TTS' : '6. Voice / Audio',
      subtitle: lang === 'id' ? 'Membacakan Panduan' : 'Natural Speech Reader',
      icon: isSpeaking ? VolumeX : Volume2,
      color: 'text-rose-400 bg-rose-500/15 border-rose-500/40',
      activeColor: 'bg-rose-600 text-white ring-2 ring-rose-400',
    },
    {
      id: 'dyslexia' as FormToolId,
      name: lang === 'id' ? '7. Dyslexia Font' : '7. Dyslexia Font',
      subtitle: lang === 'id' ? 'Spasi & Teks Ramah' : 'Clean Contrast & Spacing',
      icon: Type,
      color: 'text-teal-400 bg-teal-500/15 border-teal-500/40',
      activeColor: 'bg-teal-600 text-white ring-2 ring-teal-400',
    },
    {
      id: 'checklist' as FormToolId,
      name: lang === 'id' ? '8. Syarat Dokumen' : '8. Doc Checklist',
      subtitle: lang === 'id' ? 'Cek Lampiran Wajib' : 'Required Attachments',
      icon: FileCheck2,
      color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/40',
      activeColor: 'bg-indigo-600 text-white ring-2 ring-indigo-400',
    },
  ]

  return (
    <section id="real-action" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800 scroll-mt-16">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm shadow-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{cur.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {cur.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {cur.subtitle}
          </p>

          {/* Interactive Tab Switcher */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 shadow-inner">
              <button
                onClick={() => {
                  setActiveTab('gov')
                  triggerScanBeam()
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'gov'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Globe className="w-4 h-4 text-blue-300" />
                <span>{cur.tabGov}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('web')
                  triggerScanBeam()
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'web'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-300" />
                <span>{cur.tabWeb}</span>
              </button>
            </div>

            {/* Quick Action: Trigger Lightbeam Scan */}
            <button
              onClick={triggerScanBeam}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-60"
              title="Aktifkan simulasi berkas sinar pemindaian AI"
            >
              <Scan className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? (lang === 'id' ? 'Memindai Halaman...' : 'Scanning Page...') : (lang === 'id' ? '⚡ Pindai Sinar Lightbeam' : '⚡ Run Lightbeam Scan')}</span>
            </button>
          </div>
        </div>

        {/* 8 Form Tools Interactive Selector Dock */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
                {lang === 'id' ? 'Pilih & Uji 8 Form Tools Telmy:' : 'Select & Test 8 Telmy Form Tools:'}
              </h3>
            </div>
            <button
              onClick={handleResetDemo}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Reset Demo' : 'Reset Demo'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {FORM_TOOLS.map((tool) => {
              const Icon = tool.icon
              const isCurrent = activeTool === tool.id
              return (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer group ${
                    isCurrent
                      ? `${tool.activeColor} shadow-lg shadow-blue-500/20 scale-102`
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isCurrent ? 'bg-white/20 text-white' : tool.color
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <span className="block text-xs font-bold leading-tight">
                      {tool.name}
                    </span>
                    <span
                      className={`block text-[10px] mt-0.5 truncate ${
                        isCurrent ? 'text-white/80' : 'text-slate-400'
                      }`}
                    >
                      {tool.subtitle}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Real Chrome Browser Frame Display */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-3 sm:p-5 shadow-2xl shadow-blue-950/50 relative overflow-hidden">
          {/* Chrome Top Bar Mockup */}
          <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-700/70 mb-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
            </div>

            {/* URL Address Bar */}
            <div className="flex-1 max-w-xl bg-slate-950 border border-slate-700 rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate">{current.urlBar}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{cur.activeLabel}</span>
            </div>
          </div>

          {/* Interactive Form Showcase Container (with Lightbeam & Tool Overlays) */}
          <div
            className={`rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner relative group ${
              isDyslexiaOn ? 'font-sans tracking-wider' : ''
            }`}
          >
            {/* 1. Laser Lightbeam Scan Beam & Haze Overlay */}
            {isScanning && (
              <>
                <div className="telmy-page-scan-beam" />
                <div className="telmy-page-scan-haze" />
                {/* Floating Scan Pulse Badge */}
                <div className="absolute top-4 right-4 z-40 bg-slate-900/90 backdrop-blur-md border border-cyan-400/60 text-cyan-300 text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span>Gemini Multimodal Scanning Active...</span>
                </div>
              </>
            )}

            {/* 2. Spotlight Overlay (Tool 5) */}
            {isSpotlightOn && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-20 pointer-events-none transition-all duration-300 flex items-center justify-center">
                <div className="p-3 rounded-2xl bg-slate-900/95 border border-violet-400 text-violet-300 text-xs font-bold shadow-2xl flex items-center gap-2">
                  <Focus className="w-4 h-4" />
                  <span>Form Spotlight: Background Dimmed & ADHD Focus Mode Enabled</span>
                </div>
              </div>
            )}

            {/* Main Screenshot Background */}
            <img
              src={current.imageSrc}
              alt={current.alt}
              className={`w-full h-auto object-cover object-top transition-all duration-300 ${
                isSpotlightOn ? 'opacity-40' : 'opacity-95'
              }`}
              loading="lazy"
            />

            {/* 3. Interactive Floating Overlays for the 8 Tools */}
            {/* Tool 1: Numbered Badges (Forms Guide) */}
            {activeTool === 'guide' && (
              <div className="absolute inset-0 pointer-events-none z-25">
                <div className="absolute top-[28%] left-[16%] animate-bounce">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-lg shadow-blue-500/50 ring-2 ring-white">
                    1
                  </span>
                </div>
                <div className="absolute top-[42%] left-[16%] animate-bounce delay-100">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-lg shadow-blue-500/50 ring-2 ring-white">
                    2
                  </span>
                </div>
                <div className="absolute top-[56%] left-[16%] animate-bounce delay-200">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-lg shadow-blue-500/50 ring-2 ring-white">
                    3
                  </span>
                </div>
              </div>
            )}

            {/* Tool 2: Plain-Words Explainer Card */}
            {activeTool === 'explain' && (
              <div className="absolute bottom-6 left-6 max-w-sm sm:max-w-md bg-slate-900/95 backdrop-blur-xl border border-sky-500/60 rounded-2xl p-4 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase mb-1">
                  <Bot className="w-4 h-4" />
                  <span>{lang === 'id' ? 'Penjelasan Bahasa Manusia' : 'Plain Language Guidance'}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {lang === 'id' ? 'Apa itu "Apostille Kemenkumham"?' : 'What is "Apostille Legalization"?'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'id'
                    ? 'Apostille adalah sertifikat resmi yang membuat dokumen Indonesia Anda (seperti ijazah atau akta) sah secara hukum di 120+ negara tanpa perlu legalisasi manual di kedutaan.'
                    : 'Apostille is an official international certificate validating your local documents for use in 120+ Hague convention countries without manual embassy queues.'}
                </p>
              </div>
            )}

            {/* Tool 3: 1-Click AutoFill Pill */}
            {activeTool === 'autofill' && (
              <div className="absolute top-6 left-6 max-w-sm bg-slate-900/95 backdrop-blur-xl border border-amber-500/60 rounded-2xl p-4 shadow-2xl z-30">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Zap className="w-4 h-4 fill-amber-400" />
                    <span>{isAutofilled ? (lang === 'id' ? 'Berhasil Diisi Otomatis' : 'Vault AutoFilled!') : (lang === 'id' ? 'Siap AutoFill' : 'Ready to AutoFill')}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                    AES-256
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Nama:</span>
                    <strong className="text-white">Alexander Ward</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">No. Identitas:</span>
                    <strong className="text-white">3201241995080004</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Paspor:</span>
                    <strong className="text-white">X84910284</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Tool 4: Traffic Light Pre-Submission Audit */}
            {activeTool === 'audit' && (
              <div className="absolute top-6 right-6 max-w-xs sm:max-w-sm bg-slate-900/95 backdrop-blur-xl border border-emerald-500/60 rounded-2xl p-4 shadow-2xl z-30">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'id' ? 'Auditor Pra-Kirim Formulir' : 'Pre-Submission Form Auditor'}</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>Format NIK 16 digit: Valid</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>Masa berlaku paspor &gt; 6 bulan: Aman</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>Semua kolom wajib terisi: Siap Submit</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tool 6: Audio / Voice Mode Live Bubble */}
            {activeTool === 'tts' && (
              <div className="absolute bottom-6 right-6 max-w-sm bg-slate-900/95 backdrop-blur-xl border border-rose-500/60 rounded-2xl p-4 shadow-2xl z-30 flex items-center gap-3">
                <button
                  onClick={toggleTTS}
                  className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg cursor-pointer transition-all"
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="text-xs">
                  <span className="font-bold text-white block">
                    {isSpeaking ? (lang === 'id' ? 'Sedang Membaca...' : 'Speaking Guidance...') : (lang === 'id' ? 'Suara Jeda' : 'Voice Paused')}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {lang === 'id' ? 'Klik ikon untuk mendengar panduan suara' : 'Click icon to play/pause voice assistance'}
                  </span>
                </div>
              </div>
            )}

            {/* Tool 7: Dyslexia Friendly Tag */}
            {isDyslexiaOn && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-teal-900/90 border border-teal-400/80 text-teal-200 text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg z-30 flex items-center gap-2">
                <Type className="w-4 h-4 text-teal-300" />
                <span>Dyslexia-Friendly Spacing & High-Legibility Mode</span>
              </div>
            )}

            {/* Tool 8: Document Checklist Parser */}
            {activeTool === 'checklist' && (
              <div className="absolute bottom-6 left-6 max-w-sm sm:max-w-md bg-slate-900/95 backdrop-blur-xl border border-indigo-500/60 rounded-2xl p-4 shadow-2xl z-30">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase mb-2">
                  <FileCheck2 className="w-4 h-4" />
                  <span>{lang === 'id' ? 'Checklist Dokumen Wajib' : 'Required Document Checklist'}</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scan KTP Asli (PDF/JPG &lt; 2MB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dokumen yang dilegalisasi (Ijazah/Akta)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Surat Kuasa bermaterai (bila diwakilkan)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Context Details & Highlights */}
          <div className="mt-5 pt-4 border-t border-slate-700/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center px-2">
            <div className="md:col-span-8">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                {current.tag}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                {current.desc}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {current.highlights.map((hl, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 text-[11px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{hl}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex justify-end">
              <Link
                to="/download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all group"
              >
                <span>{cur.installBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
