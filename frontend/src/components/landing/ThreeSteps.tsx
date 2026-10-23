import React, { useState } from 'react'
import { TranslationData } from '@/data/translations'
import { DownloadCloud, Layout, CheckCircle2, Laptop, Copy, Check } from 'lucide-react'

interface ThreeStepsProps {
  t: TranslationData
}

export const ThreeSteps: React.FC<ThreeStepsProps> = ({ t }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const steps = [
    {
      num: '01',
      title: t.step1Title || "Add Telmy to your browser",
      desc: t.step1Desc || "One click from the Chrome or browser store.",
      icon: DownloadCloud,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      num: '02',
      title: t.step2Title || "Open your form as usual",
      desc: t.step2Desc || "Telmy opens beside it as an instant side guide.",
      icon: Layout,
      color: 'from-indigo-600 to-violet-600',
    },
    {
      num: '03',
      title: t.step3Title || "Tap any question",
      desc: t.step3Desc || "Telmy explains, fills, and checks. You review and submit.",
      icon: CheckCircle2,
      color: 'from-emerald-600 to-teal-600',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200/50">
            <span>Easy Setup</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2357] tracking-tight leading-tight">
            {t.stepsTitle || "Start in about a minute."}
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            {t.stepsSubtitle || "No complex setup. Three simple steps to submit with confidence."}
          </p>
        </div>

        {/* 3 Step Cards - Equal visual weight, no random highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md shadow-blue-500/15 group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <span className="text-4xl font-black text-slate-200 group-hover:text-blue-100 transition-colors select-none font-mono">
                      {step.num}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">
                    Step {step.num}
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400">
                  Ready in seconds
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile visitors helpful fallback card */}
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Visiting on mobile / Buka dari HP?
              </p>
              <p className="text-xs text-slate-500">
                {t.stepsMobileNote || "Saat ini Telmy hanya dapat dipasang di Browser Desktop (komputer/laptop). Dukungan peramban HP akan segera hadir!"}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs active:scale-98"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.stepsLinkCopied || "Link copied!"}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.stepsCopyLink || "Copy link"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
