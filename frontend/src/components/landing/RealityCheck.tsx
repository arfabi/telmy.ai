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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>UN E-Government Survey 2024</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Governments moved online. Not everyone can keep up.
          </h2>
          <p className="mt-3 text-slate-400 text-base max-w-2xl mx-auto">
            Official portals are expanding worldwide, yet digital accessibility barriers and linguistic friction still isolate millions of applicants.
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
                57%
              </div>
              <div className="text-base font-bold text-slate-200 mt-3">
                No Foreign-Language Support
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                57% of national government portals do not offer foreign-language assistance, forcing applicants to rely on risky generic machine translation that distorts legal definitions.
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
                95%
              </div>
              <div className="text-base font-bold text-slate-200 mt-3">
                Fail Accessibility Standards
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                95% of public service websites do not meet web accessibility standards (WCAG), leaving older citizens, visually impaired users, and neurodivergent individuals stranded.
              </p>
            </div>
          </div>

          {/* Stat 3: Rejected Documents */}
          <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-rose-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
                <FileX2 className="w-6 h-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
                Rejected Documents
              </div>
              <div className="text-base font-bold text-slate-200 mt-3">
                Severe Time & Financial Penalties
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                A single mistranslated field, incorrect format, or inconsistent document name can trigger repeated application fees, delayed visas, and lost life opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Conclusion Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            💡 <strong className="text-white">Generic browser translation distorts official legal terminology.</strong> Telmy.ai is engineered specifically to close this vital accessibility gap.
          </p>
        </div>
      </div>
    </section>
  )
}
