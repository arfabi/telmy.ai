import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { Shield, Lock, CheckCircle2 } from 'lucide-react'
import { SEO } from '@/components/common/SEO'

export const PrivacyPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <SEO />
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 pb-8 border-b border-slate-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Shield className="w-3.5 h-3.5" />
              <span>Official Privacy Policy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy for Telmy.ai & Browser Extension
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Last Updated: October 2026 • Valid for Google Chrome, Microsoft Edge, Firefox, and Opera extensions.
            </p>
          </div>

          {/* Quick Summary Box */}
          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200/80 mb-10 text-slate-800 text-sm leading-relaxed">
            <h3 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Summary of Our Privacy Guarantee:
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-700">
              <li><strong>Zero Plaintext:</strong> Your profile data is encrypted on your device using AES-256-GCM. We never hold your keys.</li>
              <li><strong>Zero Document Storage:</strong> Uploaded identity cards and diplomas are analyzed in temporary RAM and immediately discarded.</li>
              <li><strong>Zero Authentication Capture:</strong> Passwords, credit cards, CVVs, and OTP inputs are never captured or recorded.</li>
              <li><strong>No Data Brokering:</strong> We never sell, monetize, or transfer personal data to advertising networks.</li>
            </ul>
          </div>

          {/* Detailed Content */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect and Process</h2>
              <p>
                Telmy.ai operates as a browser extension and client-side assistance tool. To assist you with filling and auditing official forms, Telmy processes the following categories of information:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600">
                <li><strong>Form Context & Field Labels:</strong> HTML form field names, input descriptions, labels, and relevant on-screen instructions required to provide contextual explanations.</li>
                <li><strong>Encrypted User Vault:</strong> User-supplied details (such as full name, date of birth, and contact information) entered into the Telmy Smart Vault. This data is encrypted locally using the Web Crypto API prior to any cloud synchronization.</li>
                <li><strong>Temporary Document Extractions:</strong> When you upload a passport or certificate to autofill forms, OCR extraction is executed ephemerally. The source document file is purged from memory once extraction completes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Single-Purpose Exemption for Passwords & Financial Data</h2>
              <p>
                In strict accordance with Google Chrome Web Store User Data FAQ and Mozilla AMO Add-on Policies:
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Telmy.ai is engineered with hardcoded client-side filters that prevent access to input tags with <code className="bg-slate-200 px-1 py-0.5 rounded text-xs">type="password"</code>, credit card number patterns, security CVV numbers, bank PINs, and one-time authentication tokens (OTP). Such inputs are completely ignored and never processed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. How Cloud AI Analysis Works</h2>
              <p>
                To provide natural language explanations and audio voice guidance, Telmy transmits non-sensitive form field questions and contextual descriptions to Google Gemini models via Google Cloud infrastructure.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Before any request leaves your device, Telmy runs a client-side regex scrubber that masks personal identifiers (such as national ID numbers, passport codes, and phone numbers). Google Cloud does not use data submitted through enterprise API endpoints to train underlying foundation models.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Permissions Used in Browser Extensions</h2>
              <p>Telmy requests only permissions strictly necessary to deliver its core features:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600">
                <li><code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">sidePanel</code>: To render the friendly conversational assistant beside your webpage.</li>
                <li><code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">activeTab</code> & <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">scripting</code>: To read form field labels on the active web page only when the user requests an explanation or audit.</li>
                <li><code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">storage</code>: To save your client-side encrypted vault and accessibility profile preferences.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. User Control & Data Deletion</h2>
              <p>
                You retain complete control over your stored credentials. You may clear your encrypted vault, remove saved profiles, or uninstall the extension at any time directly through the extension settings, which permanently wipes all locally stored keys.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact & Data Protection Officer</h2>
              <p>
                For questions regarding this Privacy Policy or security practices, reach out to our team at:
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                Email: <a href="mailto:privacy@telmy.id" className="text-blue-600 hover:underline">privacy@telmy.id</a> / <a href="mailto:support@telmy.id" className="text-blue-600 hover:underline">support@telmy.id</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer t={t} />
    </div>
  )
}
