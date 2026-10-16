import React from 'react'
import { TranslationData } from '@/data/translations'
import { CheckCircle2, XCircle, ShieldCheck, AlertCircle } from 'lucide-react'

interface ScopeBoundaryProps {
  t: TranslationData
}

export const ScopeBoundary: React.FC<ScopeBoundaryProps> = ({ t }) => {
  const doesList = [t.scopeDoes1, t.scopeDoes2, t.scopeDoes3, t.scopeDoes4]
  const doesNotList = [
    t.scopeDoesNot1,
    t.scopeDoesNot2,
    t.scopeDoesNot3,
    t.scopeDoesNot4,
  ]

  return (
    <section className="py-20 bg-white border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4 border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Transparency & Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.scopeTitle}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.scopeSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Column 1: What Telmy Helps With */}
          <div className="bg-gradient-to-b from-blue-50/50 to-slate-50/50 rounded-2xl p-8 border border-blue-200/80 shadow-xs relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <CheckCircle2 className="w-5 h-5 stroke-[2.3]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {t.scopeDoesTitle}
              </h3>
            </div>

            <ul className="space-y-4">
              {doesList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-sm text-slate-700 leading-relaxed font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: What Telmy Doesn't Replace */}
          <div className="bg-gradient-to-b from-amber-50/30 to-slate-50/50 rounded-2xl p-8 border border-slate-200/90 shadow-xs relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-md shadow-slate-500/10">
                <AlertCircle className="w-5 h-5 stroke-[2.3]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {t.scopeDoesNotTitle}
              </h3>
            </div>

            <ul className="space-y-4">
              {doesNotList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                    <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-sm text-slate-600 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-10 max-w-3xl mx-auto text-center p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-500 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{t.scopeDisclaimer}</span>
        </div>
      </div>
    </section>
  )
}
