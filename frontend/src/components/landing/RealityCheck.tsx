import React from 'react'
import { TranslationData } from '@/data/translations'

interface RealityCheckProps {
  t: TranslationData
}

export const RealityCheck: React.FC<RealityCheckProps> = ({ t }) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            {t.unStatTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t.unStatSub}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-200 transition-colors">
            <div className="text-3xl lg:text-4xl font-extrabold text-blue-600 tracking-tight">{t.unStat1Num}</div>
            <div className="text-sm font-bold text-slate-900 mt-2">{t.unStat1Label}</div>
            <div className="text-xs text-slate-500 mt-1 leading-normal">{t.unStat1Desc}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-200 transition-colors">
            <div className="text-3xl lg:text-4xl font-extrabold text-amber-500 tracking-tight">{t.unStat2Num}</div>
            <div className="text-sm font-bold text-slate-900 mt-2">{t.unStat2Label}</div>
            <div className="text-xs text-slate-500 mt-1 leading-normal">{t.unStat2Desc}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-200 transition-colors">
            <div className="text-3xl lg:text-4xl font-extrabold text-purple-600 tracking-tight">{t.unStat3Num}</div>
            <div className="text-sm font-bold text-slate-900 mt-2">{t.unStat3Label}</div>
            <div className="text-xs text-slate-500 mt-1 leading-normal">{t.unStat3Desc}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-200 transition-colors">
            <div className="text-3xl lg:text-4xl font-extrabold text-rose-500 tracking-tight">{t.unStat4Num}</div>
            <div className="text-sm font-bold text-slate-900 mt-2">{t.unStat4Label}</div>
            <div className="text-xs text-slate-500 mt-1 leading-normal">{t.unStat4Desc}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
