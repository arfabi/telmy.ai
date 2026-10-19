import React, { useState } from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  Shield,
  KeyRound,
  Trash2,
  EyeOff,
  ServerOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Terminal
} from 'lucide-react'
import { SEO } from '@/components/common/SEO'
import { SECURITY_TRANSLATIONS } from '@/data/securityData'

export const SecurityPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const secT = SECURITY_TRANSLATIONS[currentLang] || SECURITY_TRANSLATIONS.en

  // Interactive Live PII Sanitizer Simulator (Playground)
  const [sampleRawForm, setSampleRawForm] = useState(
    JSON.stringify(
      {
        formId: 'visa_application_jp_v2',
        applicant_name: 'Budi Santoso',
        passport_number: 'A89218204',
        national_id_nik: '3201241995080004',
        credit_card_auth: '4111-2222-3333-4444',
        cvv: '892',
        user_password: 'MySecretPassword!2026',
        field_instruction: 'Explain why you are staying longer than 90 days',
        page_context: 'Ministry of Justice Japan - Residence Status'
      },
      null,
      2
    )
  )

  const [sanitizedResult, setSanitizedResult] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  // Interactive Database Ciphertext Simulator State
  const [vaultName, setVaultName] = useState('Budi Santoso')
  const [vaultPassport, setVaultPassport] = useState('X84910284')
  const [vaultPassword, setVaultPassword] = useState('MasterKey2026!')

  // Simulated pseudo-ciphertext generator (AES-256-GCM string)
  const generateCipherRecord = (name: string, passport: string) => {
    const baseStr = `${name}:${passport}:${Date.now()}`
    let hash = 0
    for (let i = 0; i < baseStr.length; i++) {
      hash = (hash << 5) - hash + baseStr.charCodeAt(i)
      hash |= 0
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0')
    return `v1.aes256gcm.iv9f4a12.ct_${hex}a90c1f4e8b7c2d1109ff88ee77b42001.tag_90a12e`
  }

  const [dbRecord, setDbRecord] = useState(generateCipherRecord(vaultName, vaultPassport))

  const runSanitizationSimulation = () => {
    setIsSimulating(true)
    setTimeout(() => {
      try {
        const parsed = JSON.parse(sampleRawForm)
        const cleaned: Record<string, any> = {}

        // Rules: Remove password, CVV, credit cards entirely. Mask name, NIK, passport.
        for (const [key, val] of Object.entries(parsed)) {
          if (
            key.toLowerCase().includes('password') ||
            key.toLowerCase().includes('cvv') ||
            key.toLowerCase().includes('credit')
          ) {
            // STRIPPED ENTIRELY
            continue
          }

          if (typeof val === 'string') {
            if (key.toLowerCase().includes('name')) {
              cleaned[key] = '[MASKED_USER_NAME]'
            } else if (key.toLowerCase().includes('passport')) {
              cleaned[key] = '[MASKED_PASSPORT_NUMBER]'
            } else if (key.toLowerCase().includes('nik') || key.toLowerCase().includes('id')) {
              cleaned[key] = '[MASKED_NATIONAL_ID]'
            } else {
              cleaned[key] = val
            }
          } else {
            cleaned[key] = val
          }
        }

        setSanitizedResult(JSON.stringify(cleaned, null, 2))
      } catch (err) {
        setSanitizedResult('Error: Invalid JSON input format.')
      }
      setIsSimulating(false)
    }, 400)
  }

  const simulateEncryption = () => {
    setDbRecord(generateCipherRecord(vaultName, vaultPassport))
  }

  const pillarIcons = [KeyRound, Trash2, EyeOff, ServerOff]
  const pillarColors = [
    { bg: 'bg-blue-600', shadow: 'shadow-blue-500/20', hover: 'hover:border-blue-400' },
    { bg: 'bg-indigo-600', shadow: 'shadow-indigo-500/20', hover: 'hover:border-indigo-400' },
    { bg: 'bg-emerald-600', shadow: 'shadow-emerald-500/20', hover: 'hover:border-emerald-400' },
    { bg: 'bg-rose-600', shadow: 'shadow-rose-500/20', hover: 'hover:border-rose-400' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <SEO />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-14 pb-20 bg-slate-900 text-white">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Shield className="w-3.5 h-3.5" />
              <span>{secT.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mx-auto">
              {secT.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{secT.heroTitleHighlight}</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {secT.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-300">
              {secT.heroBadges.map((badge, idx) => (
                <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 4 Core Pillars of Telmy Security */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {secT.pillarsTitle}
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                {secT.pillarsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {secT.pillars.map((pillar, idx) => {
                const IconComponent = pillarIcons[idx]
                const colors = pillarColors[idx]
                return (
                  <Card key={idx} className={`p-8 border-slate-200/90 ${colors.hover} hover:shadow-xl transition-all rounded-3xl bg-slate-50/50`}>
                    <div className={`w-12 h-12 rounded-2xl ${colors.bg} text-white flex items-center justify-center mb-6 shadow-md ${colors.shadow}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Interactive PII Sanitizer Playground */}
        <section className="py-20 bg-slate-900 text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Terminal className="w-3.5 h-3.5" />
                <span>{secT.playgroundBadge}</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                {secT.playgroundTitle}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {secT.playgroundSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Left Box: Raw Form Data */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-4">
                    <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      {secT.rawFormHeader}
                    </span>
                    <button
                      onClick={() => {
                        setSampleRawForm(
                          JSON.stringify(
                            {
                              applicant_name: 'Budi Santoso',
                              passport_number: 'A89218204',
                              national_id_nik: '3201241995080004',
                              credit_card_auth: '4111-2222-3333-4444',
                              cvv: '892',
                              user_password: 'MySecretPassword!2026',
                              field_instruction: 'Explain why you are staying longer than 90 days',
                              page_context: 'Ministry of Justice Japan - Residence Status'
                            },
                            null,
                            2
                          )
                        )
                        setSanitizedResult(null)
                      }}
                      className="text-xs text-slate-400 hover:text-white underline font-mono"
                    >
                      {secT.resetBtn}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">
                    Notice this payload contains sensitive items: password, credit card, and national IDs.
                  </p>

                  <textarea
                    value={sampleRawForm}
                    onChange={(e) => setSampleRawForm(e.target.value)}
                    rows={12}
                    className="w-full bg-slate-950 font-mono text-xs text-rose-300 p-4 rounded-2xl border border-slate-700 focus:border-blue-500 focus:outline-none transition-all leading-relaxed"
                  />
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    Privacy Check: Client-side only
                  </span>
                  <Button
                    onClick={runSanitizationSimulation}
                    disabled={isSimulating}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 shadow-lg shadow-blue-500/25 flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSimulating ? 'Filtering...' : secT.runSanitizerBtn}</span>
                  </Button>
                </div>
              </div>

              {/* Right Box: Clean Sanitized Result */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-4">
                    <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                      {secT.cleanOutputHeader}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {sanitizedResult ? secT.statusBadgeActive : secT.statusBadgeWaiting}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">
                    Stripped passwords & CVVs. Replaced PII with non-identifiable tokens.
                  </p>

                  {sanitizedResult ? (
                    <pre className="w-full bg-slate-950 font-mono text-xs text-emerald-300 p-4 rounded-2xl border border-emerald-500/30 overflow-x-auto leading-relaxed shadow-inner">
                      {sanitizedResult}
                    </pre>
                  ) : (
                    <div className="h-[270px] bg-slate-950/50 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono text-xs">
                      <Shield className="w-8 h-8 text-slate-600 mb-2 stroke-1" />
                      <span>Click the button on the left to execute the client-side sanitizer.</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Zero Credit Card Exposure
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">Google Gemini API</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Database Ciphertext Visualizer */}
        <section className="py-20 bg-slate-950 text-white border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl font-extrabold tracking-tight">
                {secT.vaultSimTitle}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {secT.vaultSimSubtitle}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Plain text inputs */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-mono font-bold text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>{secT.vaultInputHeader}</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">{secT.inputNameLabel}</label>
                      <input
                        type="text"
                        value={vaultName}
                        onChange={(e) => setVaultName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">{secT.inputPassportLabel}</label>
                      <input
                        type="text"
                        value={vaultPassport}
                        onChange={(e) => setVaultPassport(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">{secT.inputPasswordLabel}</label>
                      <input
                        type="password"
                        value={vaultPassword}
                        onChange={(e) => setVaultPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        {secT.inputPasswordHint}
                      </span>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={simulateEncryption}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 shadow-md shadow-blue-500/20"
                      >
                        {secT.encryptBtn}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Database Storage Record */}
                <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
                      <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        {secT.dbPayloadHeader}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {secT.dbPayloadTag}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-3 text-xs flex items-center justify-between font-mono text-slate-400">
                      <span>doc_path: <span className="text-blue-400">users/{"{uid}"}/vault/profile</span></span>
                      <span className="text-emerald-400">status: encrypted</span>
                    </div>

                    <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
                      Encrypted Ciphertext Stream (Hex payload):
                    </label>
                    <div className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl p-4 font-mono text-xs text-emerald-400 break-all leading-relaxed shadow-inner max-h-[180px] overflow-y-auto">
                      {dbRecord}
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      💡 <strong>Zero Plaintext:</strong> {secT.dbPayloadHint}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Decryption key is never uploaded to Firestore.</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      AES-GCM (256-bit)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification & Compliance Badges */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {secT.complianceTitle}
            </h3>
            <p className="text-sm text-slate-600 mb-8 max-w-2xl mx-auto">
              {secT.complianceSubtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href="/privacy"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-blue-600 text-xs font-bold transition-all"
              >
                <span>{secT.privacyLinkText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="/terms"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-blue-600 text-xs font-bold transition-all"
              >
                <span>{secT.termsLinkText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} />
    </div>
  )
}
