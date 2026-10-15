import React from 'react'
import { TranslationData } from '@/data/translations'
import { XCircle, CheckCircle2 } from 'lucide-react'

interface ComparisonProps {
  t: TranslationData
}

export const Comparison: React.FC<ComparisonProps> = ({ t }) => {
  return (
    <section className="py-20 bg-slate-100/60 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.compTitle}
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            {t.compSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Without Telmy */}
          <div className="bg-white rounded-2xl p-8 border border-red-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-400" />
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">
                  ✕
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {t.compWithoutTitle}
                </h3>
              </div>
              <ul className="space-y-5">
                <li className="flex items-start gap-3.5 text-slate-700">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.compWithout1}</span>
                </li>
                <li className="flex items-start gap-3.5 text-slate-700">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.compWithout2}</span>
                </li>
                <li className="flex items-start gap-3.5 text-slate-700">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.compWithout3}</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 text-xs font-semibold uppercase tracking-wider text-red-600">
              High rejection risk & anxiety
            </div>
          </div>

          {/* With Telmy */}
          <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 shadow-lg shadow-blue-500/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                  ✓
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {t.compWithTitle}
                </h3>
              </div>
              <ul className="space-y-5">
                <li className="flex items-start gap-3.5 text-slate-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.compWith1}</span>
                </li>
                <li className="flex items-start gap-3.5 text-slate-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.compWith2}</span>
                </li>
                <li className="flex items-start gap-3.5 text-slate-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.compWith3}</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-blue-50 text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified confident submission
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
