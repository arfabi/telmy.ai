import React, { useState } from 'react'
import { TranslationData } from '@/data/translations'
import { ShieldCheck, Lock, EyeOff, KeyRound, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PrivacySummaryProps {
  t: TranslationData
}

export const PrivacySummary: React.FC<PrivacySummaryProps> = ({ t }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  const promises = [
    {
      icon: Lock,
      title: t.safetyP1Title || "Your passport and ID stay on your device",
      desc: t.safetyP1Desc || "Saved only on your device, locked. Never uploaded to remote company servers.",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400",
    },
    {
      icon: EyeOff,
      title: t.safetyP2Title || "We can't see your documents",
      desc: t.safetyP2Desc || "Telmy staff and developers have zero access to your files, forms, or answers.",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
    },
    {
      icon: KeyRound,
      title: t.safetyP3Title || "We never touch your passwords or card numbers",
      desc: t.safetyP3Desc || "Financial details and password fields are strictly skipped by design.",
      color: "from-amber-500/20 to-yellow-500/20 text-amber-400",
    },
  ]

  return (
    <section id="safety" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm shadow-blue-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Built For Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t.safetyTitle || "Your documents stay yours."}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.safetySubtitle || "We believe private documents must stay private. Here are our three clear promises:"}
          </p>
        </div>

        {/* 3 Clear Promises (Plain words, no confusing jargon) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {promises.map((p, idx) => {
            const Icon = p.icon
            return (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-7 hover:border-blue-500/50 hover:bg-slate-800 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/50 text-xs text-slate-400 font-medium">
                  Guaranteed by architecture
                </div>
              </div>
            )
          })}
        </div>

        {/* Accordion: "For the technically curious" */}
        <div className="mt-10 max-w-3xl mx-auto bg-slate-800/60 border border-slate-700/80 rounded-2xl overflow-hidden shadow-md">
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>{t.safetyTechAccordionTitle || "For the technically curious (AES-256 & Privacy Architecture)"}</span>
            {isAccordionOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {isAccordionOpen && (
            <div className="px-6 pb-5 pt-1 border-t border-slate-700/60 text-xs sm:text-sm text-slate-400 space-y-3 leading-relaxed animate-fade-in">
              <p>
                {t.safetyTechDetails ||
                  "Your local vault uses client-side AES-256-GCM encryption with keys derived on your machine. OCR document parsing happens in-memory with zero retention. Questions sent for AI assistance strip all personally identifiable markers."}
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  [TODO: owner confirms exactly what data, if any, leaves the device and is processed by the AI provider]
                </span>
                <Link
                  to="/security"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 underline"
                >
                  <span>Read full Security Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
