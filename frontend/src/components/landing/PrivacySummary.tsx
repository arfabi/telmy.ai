import React from 'react'
import { TranslationData } from '@/data/translations'
import { Lock, EyeOff, FileText, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PrivacySummaryProps {
  t?: TranslationData
}

export const PrivacySummary: React.FC<PrivacySummaryProps> = () => {
  const cards = [
    {
      icon: Lock,
      title: "Encrypted on your device",
      desc: "Your saved profile is encrypted directly in your browser using AES-256-GCM before storage. Encryption keys never leave your machine.",
    },
    {
      icon: FileText,
      title: "Documents aren't kept",
      desc: "Uploaded ID cards, diplomas, or passport photos are read by OCR in volatile memory and discarded immediately with zero document retention.",
    },
    {
      icon: EyeOff,
      title: "Personal data masked",
      desc: "Sensitive details like NIK, passport numbers, and phone numbers are strictly masked before form layout context is sent for AI analysis.",
    },
    {
      icon: KeyRound,
      title: "Passwords stay private",
      desc: "Password fields, credit card numbers, and security codes (CVV) are completely ignored and never captured or read by Telmy.",
    },
  ]

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security by Design</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Your information stays yours
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            Forms hold your most personal details. Here is exactly how Telmy handles and protects them.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Security Architecture & Transparency Link Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
          <div className="text-left flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>
              <strong className="text-white">Zero Plaintext Access & AES-256 Vault:</strong> Want to test our client-side PII sanitizer simulator and verify our encryption model?
            </span>
          </div>
          <Link
            to="/security"
            className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 group"
          >
            <span>Explore Security Page</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
