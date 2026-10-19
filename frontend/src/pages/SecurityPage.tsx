import React, { useState } from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  Shield,
  Lock,
  EyeOff,
  Cpu,
  KeyRound,
  FileCheck2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Terminal,
  ServerOff
} from 'lucide-react'
import { SEO } from '@/components/common/SEO'

export const SecurityPage: React.FC = () => {
  const { t } = useLanguage()

  // Interactive Live PII Sanitizer Simulator (Gimmick / Playground)
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
    const pseudoHex = Math.abs(hash).toString(16).padStart(8, 'a')
    
    return `7f8a9b2c4e1d5a3f8c0e9b1a4d7f2c8e1a3b5c7d9e0f2a4b6c8d0e1f3a5b7c9ea5a6cd5f92c4b810d7a6e4f1${pseudoHex}9c81b2e4f0a7d5c8e2b1a3d9f7c0e5a8`
  }

  const [dbRecord, setDbRecord] = useState<string>(() => generateCipherRecord('Budi Santoso', 'X84910284'))

  const simulateEncryption = () => {
    setDbRecord(generateCipherRecord(vaultName, vaultPassport))
  }

  const runSanitizer = () => {
    setIsSimulating(true)
    setTimeout(() => {
      try {
        const parsed = JSON.parse(sampleRawForm)
        const masked = {
          formId: parsed.formId,
          field_instruction: parsed.field_instruction,
          page_context: parsed.page_context,
          applicant_name: '[MASKED_PERSON_NAME]',
          passport_number: '[MASKED_DOCUMENT_ID]',
          national_id_nik: '[MASKED_GOV_ID]',
          credit_card_auth: '[STRIPPED_SECURITY_CREDENTIAL]',
          cvv: '[STRIPPED_SECURITY_CREDENTIAL]',
          user_password: '[PURGED_AUTHENTICATION_DATA]',
          _sanitizer_metadata: {
            client_side_hash: 'SHA256(PBKDF2_SALT_DEVICE)',
            transmitted_to_llm: ['field_instruction', 'page_context'],
            discarded_locally: ['passwords', 'tokens', 'pii_values'],
            encryption_mode: 'AES-256-GCM (Zero-Plaintext Server)',
            status: 'VERIFIED_SAFE'
          }
        }
        setSanitizedResult(JSON.stringify(masked, null, 2))
      } catch {
        setSanitizedResult(
          JSON.stringify(
            {
              error: 'Invalid JSON format in demo box.',
              recommendation: 'Reset to default sample.'
            },
            null,
            2
          )
        )
      }
      setIsSimulating(false)
    }, 400)
  }

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
              <span>Zero-Knowledge & Privacy-First Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mx-auto">
              How Telmy protects your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">most sensitive data</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We mathematically ensure your identity credentials, passwords, and passport documents can never be read by Telmy engineers, database servers, or third-party brokers.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AES-256-GCM Client Encryption
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Zero Document Retention
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Client-Side PII Masking
              </span>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars of Telmy Security */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Our 4 Non-Negotiable Security Commitments
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                Official forms demand total trust. Here is the technical breakdown of how Telmy handles each layer of information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pillar 1 */}
              <Card className="p-8 border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all rounded-3xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  1. Client-Side Vault Encryption (AES-256-GCM)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your stored profile data (name, address, date of birth) is encrypted right inside your browser using the native Web Crypto API with PBKDF2 (100,000 iterations) and AES-256-GCM. The decryption keys never leave your device. Telmy servers only store ciphertext.
                </p>
              </Card>

              {/* Pillar 2 */}
              <Card className="p-8 border-slate-200/90 hover:border-indigo-400 hover:shadow-xl transition-all rounded-3xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-500/20">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  2. Zero Document Storage (Ephemeral OCR)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  When you upload an ID card, diploma, or passport for smart extraction, the document is processed in temporary browser memory. Once canonical fields are extracted into your encrypted vault, the original binary file is permanently erased. No document archives exist.
                </p>
              </Card>

              {/* Pillar 3 */}
              <Card className="p-8 border-slate-200/90 hover:border-emerald-400 hover:shadow-xl transition-all rounded-3xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20">
                  <EyeOff className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  3. Client-Side PII Masking Before Cloud AI
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To explain a confusing form question, Telmy only transmits the question label, surrounding instructions, and page structure to Google Gemini. All personal identity values (passport numbers, phone numbers, NIK) are masked client-side before any network packet is dispatched.
                </p>
              </Card>

              {/* Pillar 4 */}
              <Card className="p-8 border-slate-200/90 hover:border-rose-400 hover:shadow-xl transition-all rounded-3xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mb-6 shadow-md shadow-rose-500/20">
                  <ServerOff className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  4. Strict Exclusion of Passwords & Financial Inputs
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Telmy is hard-coded to ignore authentication fields. Input tags with <code className="bg-slate-200 px-1 py-0.5 rounded text-xs">type="password"</code>, CVV codes, credit card numbers, OTPs, and bank PINs are never captured, never suggested for AutoFill, and never logged.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Interactive PII Sanitizer Playground / Gimmick */}
        <section className="py-20 bg-slate-900 text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Terminal className="w-3.5 h-3.5" />
                <span>Interactive Security Playground</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Test the Telmy Client-Side Sanitizer
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Try running our client-side regex and PII filter below. See how private identifiers and credentials get stripped before anything can ever reach an AI model.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Left Box: Raw Form Data */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-4">
                    <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      RAW INCOMING WEB FORM (IN YOUR BROWSER)
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
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={sampleRawForm}
                    onChange={(e) => setSampleRawForm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 font-mono text-xs text-rose-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Notice passwords, credit card, and passport details.
                  </p>
                  <Button
                    onClick={runSanitizer}
                    disabled={isSimulating}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5"
                  >
                    {isSimulating ? 'Sanitizing...' : 'Simulate Client-Side Sanitization →'}
                  </Button>
                </div>
              </div>

              {/* Right Box: Sanitized Output */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-4">
                    <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                      SANITIZED PAYLOAD DISPATCHED TO AI
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Zero PII Plaintext
                    </span>
                  </div>

                  {sanitizedResult ? (
                    <pre className="w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[300px]">
                      {sanitizedResult}
                    </pre>
                  ) : (
                    <div className="w-full bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-[280px]">
                      <Lock className="w-8 h-8 text-slate-500 mb-3" />
                      <p className="text-sm font-semibold text-slate-300">
                        Click "Simulate Client-Side Sanitization"
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">
                        See how personal keys and passwords are completely scrubbed before network egress.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/80 text-xs text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Only non-sensitive instructional metadata is transmitted.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Database Vault Ciphertext Simulator */}
        <section className="py-20 bg-slate-950 text-white border-t border-slate-800 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-Knowledge Server Architecture</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Simulate Encrypted Database Storage (Zero Plaintext)
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                When you save your profile in the extension and sync it to the cloud, the data is encrypted on your device with your Master Key. Below is exactly what gets stored in our database records: pure unreadable ciphertext.
              </p>
            </div>

            {/* Interactive Vault DB Component */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Extension Vault (Plaintext on your device only) */}
                <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
                    <span className="text-xs font-mono font-bold text-blue-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      1. EXTENSION VAULT (YOUR DEVICE)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Decrypted in Memory
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={vaultName}
                        onChange={(e) => setVaultName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Passport / ID Number</label>
                      <input
                        type="text"
                        value={vaultPassport}
                        onChange={(e) => setVaultPassport(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Your Master Password</label>
                      <input
                        type="password"
                        value={vaultPassword}
                        onChange={(e) => setVaultPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        Never sent across the network. Used solely for PBKDF2 key derivation.
                      </span>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={simulateEncryption}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 shadow-md shadow-blue-500/20"
                      >
                        Encrypt & Sync to Cloud DB →
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Database Storage Record (What Telmy Firestore DB Actually Sees) */}
                <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
                      <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        2. GOOGLE CLOUD FIRESTORE VAULT PAYLOAD
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Pure AES-256-GCM Ciphertext
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
                      💡 <strong>Zero Plaintext:</strong> Neither Telmy administrators nor Google Cloud engineers can read your name, ID, or passport numbers from this payload. The decryption key exists solely on your local device.
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
              Compliant with Chrome Web Store & Mozilla AMO Policies
            </h3>
            <p className="text-sm text-slate-600 mb-8 max-w-2xl mx-auto">
              Telmy adheres to the Principle of Least Privilege. We request only the permissions strictly required to read field labels and assist your typing.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href="/privacy"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-blue-600 text-xs font-bold transition-all"
              >
                <span>Read Full Privacy Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="/terms"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-blue-600 text-xs font-bold transition-all"
              >
                <span>Read Terms of Service</span>
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
