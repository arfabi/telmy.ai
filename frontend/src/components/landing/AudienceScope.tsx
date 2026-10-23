import React from 'react'
import { TranslationData } from '@/data/translations'
import { GraduationCap, Plane, FileCheck, CheckCircle2, AlertCircle, Info } from 'lucide-react'

interface AudienceScopeProps {
  t: TranslationData
}

export const AudienceScope: React.FC<AudienceScopeProps> = ({ t }) => {
  const useCases = [
    {
      icon: GraduationCap,
      title: t.whoForCard1Title || "Scholarship Applications",
      desc: t.whoForCard1Desc || "Understand application questions, supporting document requests, and requirements clearly.",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: Plane,
      title: t.whoForCard2Title || "Visas and Travel Forms",
      desc: t.whoForCard2Desc || "Get help understanding unfamiliar questions and official instructions when completing travel paperwork.",
      color: "from-indigo-600 to-violet-600",
    },
    {
      icon: FileCheck,
      title: t.whoForCard3Title || "Everyday Online Forms",
      desc: t.whoForCard3Desc || "Get guidance when civil registration, permits, or banking forms leave you unsure what to enter.",
      color: "from-emerald-600 to-teal-600",
    },
  ]

  const helpsList = [
    t.scopeDoes1 || "Explaining confusing questions in plain words.",
    t.scopeDoes2 || "Simplifying complex instructions and document requirements.",
    t.scopeDoes3 || "Guiding you through supported online forms step-by-step.",
    t.scopeDoes4 || "Checking answers for missing fields and likely mistakes before submit.",
  ]

  const replacesNotList = [
    t.scopeDoesNot1 || "The organization's official instructions and regulations.",
    t.scopeDoesNot2 || "Your responsibility to provide truthful and accurate information.",
    t.scopeDoesNot3 || "Professional legal, financial, or immigration advice.",
    t.scopeDoesNot4 || "Your final personal review and decision to submit.",
  ]

  return (
    <section id="audience" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Use Cases & Scope</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2357] tracking-tight leading-tight">
            {t.whoForTitle || "Made for the forms that worry you most."}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            {t.whoForSubtitle || "From study abroad to visas and official permits, Telmy helps you understand what's required."}
          </p>
        </div>

        {/* 3 Use Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {useCases.map((c, idx) => {
            const Icon = c.icon
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-slate-50/80 border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/15`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Small one-line portal list */}
        <div className="text-center mb-14 text-xs text-slate-500 font-medium">
          <span>{t.whoForClosing || "Works with forms like Chevening, LPDP, DAAD, Schengen Visa, ESTA, and public service portals."}</span>
        </div>

        {/* Compact Two-Column Scope Boundaries Block */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: What Telmy Helps With */}
            <div>
              <div className="flex items-center gap-2.5 text-blue-700 font-bold text-base mb-5 pb-3 border-b border-slate-200/80">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span>{t.boundaryHelpsTitle || "Telmy helps with:"}</span>
              </div>
              <ul className="space-y-3.5">
                {helpsList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: What Telmy Doesn't Replace */}
            <div>
              <div className="flex items-center gap-2.5 text-slate-700 font-bold text-base mb-5 pb-3 border-b border-slate-200/80">
                <AlertCircle className="w-5 h-5 text-slate-500 shrink-0" />
                <span>{t.boundaryReplacesTitle || "Telmy doesn't replace:"}</span>
              </div>
              <ul className="space-y-3.5">
                {replacesNotList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Clear Disclaimer Line */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 text-center text-xs font-semibold text-slate-500 flex items-center justify-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{t.scopeDisclaimer || "You decide and submit. Telmy is not a government agency."}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
