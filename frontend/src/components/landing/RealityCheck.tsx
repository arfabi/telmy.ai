import React from 'react'
import { TranslationData } from '@/data/translations'
import { AlertCircle, Globe2, EyeOff, FileX2 } from 'lucide-react'

interface RealityCheckProps {
  t: TranslationData
}

export const RealityCheck: React.FC<RealityCheckProps> = ({ t }) => {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <a
            href="https://publicadministration.un.org/egovkb/en-us/reports/un-e-government-survey-2024"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:text-rose-300 hover:border-rose-400 text-xs font-bold uppercase tracking-wider mb-4 transition-all group"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>UN E-Government Survey 2024</span>
            <span className="text-[11px] font-normal lowercase opacity-75 group-hover:translate-x-0.5 transition-transform">↗</span>
          </a>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.unStatTitle}
          </h2>
          <p className="mt-3 text-slate-400 text-base max-w-2xl mx-auto">
            {t.unStatSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Stat 1: 57% Foreign Language */}
          <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                <Globe2 className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                {t.unStat3Num}
              </div>
              <div className="text-base font-bold text-slate-200 mt-3">
                {t.unStat3Label}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t.unStat3Desc}
              </p>
            </div>
          </div>

          {/* Stat 2: 95% Fail Accessibility */}
          <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <EyeOff className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono text-amber-400">
                {t.unStat4Num}
              </div>
              <div className="text-base font-bold text-slate-200 mt-3">
                {t.unStat4Label}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t.unStat4Desc}
              </p>
            </div>
          </div>

          {/* Stat 3: 52% Lack Live Help Desk */}
          <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-rose-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
                <FileX2 className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono text-rose-400">
                {t.unStat2Num}
              </div>
              <div className="text-base font-bold text-slate-200 mt-3">
                {t.unStat2Label}
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t.unStat2Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Conclusion Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            💡 <strong className="text-white">{t.heroKicker}</strong> {t.compWithout2} {t.compWith1}
          </p>
        </div>
      </div>
    </section>
  )
}
